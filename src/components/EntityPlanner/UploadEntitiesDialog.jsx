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

export const UploadEntitiesDialog = ({ client, match, trial, entities }) => {
    const { setWorking, setRefreshMessage, setErrorMessage } = useContext(WorkingContext);
    const { setEntityLocations, setEntityProperties } = useEntities();
    // const [fileFormat, setFileFormat] = useState('CSV');
    const [open, setOpen] = useState(false);
    const [uploadStatus, setUploadStatus] = useState();

    const setEntitiesFromFile = async (entitiesFromFile) => {
        // this is a slow but working way to set locations and props, better use another function from TrialContext/Trials/uploadCsv.js
        const entitiesWithLocation = entitiesFromFile.filter(({ location }) => location);
        const layersOnEntities = [...new Set(entitiesWithLocation.map(({ location }) => location.val.name))];
        let i = 1;
        for (const layerChosen of layersOnEntities) {
            setUploadStatus(`setting locations on ${layerChosen} which is ${i++}/${layersOnEntities.length}`);
            const entitiesOnLayer = entitiesWithLocation.filter(({ location }) => location.val.name === layerChosen);
            const entityItemKeys = entitiesOnLayer.map(({ entityItem }) => entityItem.key);
            const newLocations = entitiesOnLayer.map(({ location }) => location.val.coordinates.map(parseFloat));
            await setEntityLocations(entityItemKeys, layerChosen, newLocations);
        }
        i = 1;
        for (const e of entitiesFromFile) {
            setUploadStatus(`setting properties on ${e.entityItem.name} of ${e.entityType.name} which is ${i++}/${entitiesFromFile.length}\n(${e.entityItem.key})`);
            await setEntityProperties(e.entityItem.key, e.properties);
        }
        setUploadStatus();
    }

    const uploadInfo = async (e, fileFormat) => {
        // setWorking(true);
        try {
            const text = await e.target.files[0].text();
            const entitiesFromFile = extractEntitiesFromFile(text, fileFormat, trial, entities);
            console.log('entitiesFromFile:', entitiesFromFile);
            await setEntitiesFromFile(entitiesFromFile);
            // await uploadEntities(text, trial, client, match, entities, fileFormat)
            setRefreshMessage();
        } catch (e) {
            setErrorMessage('Uploading error: ' + e);
            console.log(e)
        }
        setOpen(false);
        // setWorking(false);
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
                onClose={() => setOpen(false)}
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
                        onClick={() => setOpen(false)}
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
                        {/* <br /> */}
                        {/* <RadioGroup
                            // row
                            value={fileFormat}
                            onChange={e => setFileFormat(e.target.value)}
                        >
                            <FormControlLabel value="CSV" control={<Radio />} label="CSV" />
                            <FormControlLabel value="GeoJson" control={<Radio />} label="GeoJson" />
                        </RadioGroup>
                        <br /> */}
                        {(uploadStatus && uploadStatus.length)
                            ? <span>
                                <br />
                                {uploadStatus.split('\n').map(x => (
                                    <>
                                        <br />
                                        {x}
                                    </>
                                ))}
                            </span>
                            : null
                        }
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}