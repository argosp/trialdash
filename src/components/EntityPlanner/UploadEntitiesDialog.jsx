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

    const locationFromProps = (props) => {
        const { MapName, Longitude, Latitude } = props;
        const location = { name: MapName, coordinates: [Latitude, Longitude] };
        if (MapName && Longitude && Latitude) {
            return location;
        }
        return undefined;
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
        // let errors = [];

        // const entitiesFromFile = [];

        let i = 1;
        for (const { name, entitiesTypeName, ...props } of json) {
            const { entityType, entityItem } = findEntity(name, entitiesTypeName);
            if (!entityType || !entityItem) {
                dispatch({ error: `entity ${name} of type ${entitiesTypeName} is unknown` });
                continue;
            }

            const properties = nonLocationFromProps(props, entityType);
            dispatch({ update: [`setting properties on ${entityItem.name} of ${entityType.name} which is ${i++}/${json.length}`, `(${entityItem.key})`] });
            try {
                await setEntityProperties(entityItem.key, properties);
            } catch (e) {
                dispatch({ error: `error on setting properties for ${entityItem.name} of ${entityType.name}: ${e}` });
            }
        }

        // for (const { name, entitiesTypeName, ...props } of json) {
        //     const properties = [];

        //     const { MapName, Longitude, Latitude } = props;
        //     let location = undefined;
        //     if (MapName && Longitude && Latitude) {
        //         const locationProp = entityType.properties.find(({ type }) => type === 'location');
        //         if (locationProp) {
        //             const val = { name: MapName, coordinates: [Latitude, Longitude] };
        //             location = { prop: locationProp, val };
        //         }
        //     }

        //     for (const [propName, propValue] of Object.entries(props)) {
        //         if (location && ['MapName', 'Longitude', 'Latitude'].includes(propName)) {
        //             continue;
        //         }
        //         const propType = entityType.properties.find(({ label }) => label === propName);
        //         if (propType) {
        //             properties.push({ key: propType.key, val: propValue.replace(/'/g, "\"") });
        //         }
        //     }

        //     const entityTrial = trial.entities.find(e => e.key === entityItem.key) || {};
        //     entitiesFromFile.push({ ...entityTrial, properties, entityItem, entityType, location });
        // }

        // // this is a slow but working way to set locations and props, better use another function from TrialContext/Trials/uploadCsv.js
        // const entitiesWithLocation = entitiesFromFile.filter(({ location }) => location);
        // const layersOnEntities = [...new Set(entitiesWithLocation.map(({ location }) => location.val.name))];
        // let i = 1;
        // for (const layerChosen of layersOnEntities) {
        //     dispatch({ update: [`setting locations on ${layerChosen} which is ${i++}/${layersOnEntities.length}`] });
        //     const entitiesOnLayer = entitiesWithLocation.filter(({ location }) => location.val.name === layerChosen);
        //     const entityItemKeys = entitiesOnLayer.map(({ entityItem }) => entityItem.key);
        //     const newLocations = entitiesOnLayer.map(({ location }) => location.val.coordinates.map(parseFloat));
        //     try {
        //         await setEntityLocations(entityItemKeys, layerChosen, newLocations);
        //     } catch (e) {
        //         dispatch({ error: `error on setting locations for ${layerChosen}: ${e}` });
        //     }
        // }
        // i = 1;
        // for (const e of entitiesFromFile) {
        //     const name = `${e.entityItem.name} of ${e.entityType.name}`;
        //     dispatch({ update: [`setting properties on ${name} which is ${i++}/${entitiesFromFile.length}`, `(${e.entityItem.key})`] });
        //     try {
        //         await setEntityProperties(e.entityItem.key, e.properties);
        //     } catch (e) {
        //         dispatch({ error: `error on setting properties for ${name}: ${e}` });
        //     }
        // }
        // return errors;
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