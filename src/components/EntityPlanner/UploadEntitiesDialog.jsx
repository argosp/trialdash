import React, { useContext, useState } from 'react';
import {
    Box,
    Button, IconButton, Dialog,
    DialogTitle,
    DialogContent, Tooltip
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from "@mui/icons-material/Close";
import { downloadEntities } from '../TrialContext/Trials/downloadCsv';
import { extractEntitiesFromFile } from '../TrialContext/Trials/uploadCsv';
import { WorkingContext } from '../AppLayout/AppLayout.jsx';
import { ButtonWithFileInput } from '../ButtonWithFileInput';
import { useEntities } from './EntitiesContext';

const ArrayToBRs = ({ array }) => {
    return (
        <>
            {(array || []).map((x, i) => i === 0
                ? x
                : <>
                    <br />
                    {x}
                </>)}
        </>
    )
}

export const UploadEntitiesDialog = ({ client, match, trial, entities }) => {
    const { setWorking, setRefreshMessage, setErrorMessage } = useContext(WorkingContext);
    const { setEntityLocations, setEntityProperties } = useEntities();
    // const [fileFormat, setFileFormat] = useState('CSV');
    const [open, setOpen] = useState(false);
    const [uploadStatus, setUploadStatus] = useState();
    const [uploadErrors, setUploadErrors] = useState();
    const [showRefresh, setShowRefresh] = useState();

    const setEntitiesFromFile = async (entitiesFromFile) => {
        let errors = [];
        // this is a slow but working way to set locations and props, better use another function from TrialContext/Trials/uploadCsv.js
        const entitiesWithLocation = entitiesFromFile.filter(({ location }) => location);
        const layersOnEntities = [...new Set(entitiesWithLocation.map(({ location }) => location.val.name))];
        let i = 1;
        for (const layerChosen of layersOnEntities) {
            setUploadStatus([`setting locations on ${layerChosen} which is ${i++}/${layersOnEntities.length}`]);
            const entitiesOnLayer = entitiesWithLocation.filter(({ location }) => location.val.name === layerChosen);
            const entityItemKeys = entitiesOnLayer.map(({ entityItem }) => entityItem.key);
            const newLocations = entitiesOnLayer.map(({ location }) => location.val.coordinates.map(parseFloat));
            try {
                await setEntityLocations(entityItemKeys, layerChosen, newLocations);
            } catch (e) {
                console.log(e)
                errors = [...errors, `error on setting locations for ${layerChosen}: ${e}`];
                setUploadErrors(errors);
            }
        }
        i = 1;
        for (const e of entitiesFromFile) {
            const name = `${e.entityItem.name} of ${e.entityType.name}`;
            setUploadStatus([`setting properties on ${name} which is ${i++}/${entitiesFromFile.length}`, `(${e.entityItem.key})`]);
            try {
                await setEntityProperties(e.entityItem.key, e.properties);
            } catch (e) {
                console.log(e)
                errors = [...errors, `error on setting properties for ${name}: ${e}`];
                setUploadErrors(errors);
            }
        }
        return errors;
    }

    const uploadInfo = async (e, fileFormat) => {
        // setWorking(true);
        setShowRefresh(false);
        setUploadErrors();
        try {
            const text = await e.target.files[0].text();
            const entitiesFromFile = extractEntitiesFromFile(text, fileFormat, trial, entities);
            console.log('entitiesFromFile:', entitiesFromFile);
            await setEntitiesFromFile(entitiesFromFile);
            setUploadStatus();
            setShowRefresh(true);
        } catch (e) {
            console.log(e)
            setUploadErrors(`Uploading error: ${e}`);
        }
    }

    const downloadInfo = async (fileFormat) => {
        setWorking(true);
        try {
            await downloadEntities({ client, match, trial, fileFormat });
        } catch (e) {
            console.log(e)
        }
        setOpen(false);
        setWorking(false);
    }

    const handleClose = () => {
        setShowRefresh(false);
        setUploadStatus();
        setUploadErrors();
        setOpen(false);
    }

    return (
        <>
            <Tooltip title='Upload & Download Entities' placement="top">
                <IconButton
                    onClick={() => setOpen(true)}
                >
                    <SaveIcon />
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={() => handleClose()}
            >
                <DialogTitle
                    id="customized-dialog-title"
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <span>
                        Upload & Download Entities
                    </span>
                    <IconButton
                        size='small'
                        onClick={() => handleClose()}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box textAlign='center'>
                        <ButtonWithFileInput variant={'outlined'} color={'primary'}
                            onChange={(e) => uploadInfo(e, 'csv')}
                        >
                            Upload CSV
                        </ButtonWithFileInput>
                        &nbsp;
                        <ButtonWithFileInput variant={'outlined'} color={'primary'}
                            onChange={(e) => uploadInfo(e, 'geojson')}
                        >
                            Upload GeoJson
                        </ButtonWithFileInput>
                        <br />
                        <br />
                        <Button variant={'outlined'} color={'primary'}
                            onClick={() => downloadInfo('csv')}
                        >
                            Download CSV
                        </Button>
                        &nbsp;
                        <Button variant={'outlined'} color={'primary'}
                            onClick={() => downloadInfo('geojson')}

                        >
                            Download GeoJson
                        </Button>
                        <br />
                        {(uploadStatus || []).map(x => (
                            <p>
                                {x}
                            </p>))}
                        {!showRefresh ? null : (
                            <>
                                <p>
                                    Please refresh to apply changes &nbsp;
                                    <Button variant={'outlined'} color={'primary'}
                                        onClick={() => {
                                            window.location.reload();
                                        }}
                                    >
                                        Refresh now
                                    </Button>
                                </p>
                            </>
                        )}
                        {(uploadErrors || []).map(x => (
                            <p style={{ color: 'red', fontSize: 'x-small' }}>
                                {x}
                            </p>))}
                    </Box>
                </DialogContent>
            </Dialog >
        </>
    )
}