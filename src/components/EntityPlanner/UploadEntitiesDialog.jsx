import React, { useContext, useReducer, useState } from 'react';
import {
    Box,
    Button, IconButton, Dialog,
    DialogTitle,
    DialogContent, Tooltip
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from "@mui/icons-material/Close";
import { downloadEntities } from '../TrialContext/Trials/downloadCsv';
import { extractEntitiesFromFile, fileTextToEntitiesJson } from '../TrialContext/Trials/uploadCsv';
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
    const [open, setOpen] = useState(false);
    const [status, dispatch] = useReducer((prevStatus, action) => {
        if (action.error) {
            console.error(action.error);
            const uploadErrors = [...(prevStatus.uploadErrors || []), action.error];
            return { ...prevStatus, uploadErrors };
        } else if (action.update) {
            return { ...prevStatus, uploadStatus: action.update };
        } else if (action.refresh) {
            return { ...prevStatus, showRefresh: action.refresh };
        } else if (action.clear) {
            return {};
        }
    }, {});

    const findEntity = (entityItemName, entitiesTypeName) => {
        const entityType = entities.find(et => et.name === entitiesTypeName);
        const entityItem = entityType && entityType.items.find(ei => ei.name === entityItemName);
        return { entityType, entityItem };
    }

    const locationFromProps = (props, entityType) => {
        const { MapName, Longitude, Latitude } = props;
        if (MapName && Longitude && Latitude) {
            const lng = parseFloat(Longitude);
            const lat = parseFloat(Latitude);
            const locationProp = entityType.properties.find(({ type }) => type === 'location');
            if (locationProp && isFinite(lng) && isFinite(lat)) {
                return { MapName, coordinates: [lat, lng] };
            }
        }
        return {};
    }

    const nonLocationFromProps = (props, entityType) => {
        const properties = [];
        for (const [propName, propValue] of Object.entries(props)) {
            if (['MapName', 'Longitude', 'Latitude'].includes(propName)) {
                continue;
            }
            const propType = entityType.properties.find(({ label }) => label === propName);
            if (!propType) {
                continue;
            }
            const val = propValue.replace(/'/g, "\"");
            const key = propType.key;
            properties.push({ key, val });
        }
        return properties;
    }

    const setEntitiesFromFile = async (json) => {
        console.log(json);

        const layersToLocationItems = {};

        let i = 1;
        for (const { name, entitiesTypeName, ...props } of json) {
            const { entityType, entityItem } = findEntity(name, entitiesTypeName);
            if (!entityType || !entityItem) {
                dispatch({ error: `entity ${name} of type ${entitiesTypeName} is unknown` });
                continue;
            }

            try {
                const properties = nonLocationFromProps(props, entityType);
                dispatch({ update: [`setting ${properties.length} properties on ${entityItem.name} of ${entityType.name} which is ${i++}/${json.length}`, `(${entityItem.key})`] });
                await setEntityProperties(entityItem.key, properties);
            } catch (e) {
                dispatch({ error: `error on setting properties for ${entityItem.name} of ${entityType.name}: ${e}` });
            }

            const { MapName, coordinates } = locationFromProps(props, entityType);
            if (MapName) {
                layersToLocationItems[MapName] ||= [];
                layersToLocationItems[MapName].push({ entityItem, coordinates });
            }
        }

        const layersToLoc = Object.entries(layersToLocationItems);
        i = 1;
        for (const [MapName, items] of layersToLoc) {
            try {
                dispatch({ update: [`setting ${items.length} locations on ${MapName} which is ${i++}/${layersToLoc.length}`] });
                const entityItemKeys = items.map(({ entityItem }) => entityItem.key);
                const newLocations = items.map(({ coordinates }) => coordinates);
                await setEntityLocations(entityItemKeys, MapName, newLocations);
            } catch (e) {
                dispatch({ error: `error on setting locations for ${MapName}: ${e}` });
            }
        }
    }

    const uploadInfo = async (e, fileFormat) => {
        // setWorking(true);
        dispatch({ clear: 1 });
        try {
            const text = await e.target.files[0].text();
            const json = fileTextToEntitiesJson(text, fileFormat);
            await setEntitiesFromFile(json);
            dispatch({ refresh: 1 });
        } catch (err) {
            dispatch({ error: err });
        }
    }

    const downloadInfo = async (fileFormat) => {
        setWorking(true);
        try {
            await downloadEntities({ client, match, trial, fileFormat });
        } catch (e) {
            dispatch({ error: `Download error: ${e}` });
        }
        setOpen(false);
        setWorking(false);
    }

    const handleClose = () => {
        dispatch({ clear: 1 });
        setOpen(false);
    }

    console.log(status)
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
                        <ButtonWithFileInput variant={'outlined'} color={'primary'} key={1}
                            onChange={(e) => uploadInfo(e, 'csv')}
                        >
                            Upload CSV
                        </ButtonWithFileInput>
                        &nbsp;
                        <ButtonWithFileInput variant={'outlined'} color={'primary'} key={2}
                            onChange={(e) => uploadInfo(e, 'geojson')}
                        >
                            Upload GeoJson
                        </ButtonWithFileInput>
                        <br />
                        <br />
                        <Button variant={'outlined'} color={'primary'} key={3}
                            onClick={() => downloadInfo('csv')}
                        >
                            Download CSV
                        </Button>
                        &nbsp;
                        <Button variant={'outlined'} color={'primary'} key={4}
                            onClick={() => downloadInfo('geojson')}

                        >
                            Download GeoJson
                        </Button>
                        <br />
                        {(status.uploadStatus || []).map((x, i) => (
                            <p key={'p' + i}>
                                {x + ''}
                            </p>))}
                        {!status.showRefresh ? null : (
                            <>
                                <p key={'r'}>
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
                        {(status.uploadErrors || []).map(x => (
                            <p style={{ color: 'red', fontSize: 'x-small' }} key={'err'}>
                                {x + ''}
                            </p>))}
                    </Box>
                </DialogContent>
            </Dialog >
        </>
    )
}