import React, { useState } from 'react';
import {
    Grid,
    TextField,
    Typography,
} from '@material-ui/core';
import {
    Check,
    Close,
} from "@material-ui/icons";
import { PenIcon } from '../../constants/icons';
import { useEntities } from './EntitiesContext.jsx';
import { ButtonTooltip } from './ButtonTooltip.jsx';

export const SingleEntityPropertiesView = ({ entityType, entityItem, devLocation }) => {
    const { setEntityProperties, setEntityLocations } = useEntities();
    const [isEditLocation, setIsEditLocation] = useState(false);

    const savedValues = entityType.properties //.filter(({ type }) => type !== 'location')
        .flatMap(({ key: typePropertyKey, label, defaultValue, type }) => {
            const valprop = entityItem.properties.find(({ key: itemPropertyKey }) => itemPropertyKey === typePropertyKey);
            let val = '';
            if (valprop && valprop.val !== undefined && valprop.val !== null) {
                val = valprop.val;
            } else if (defaultValue !== null && defaultValue !== undefined) {
                val = defaultValue;
            }
            if (type !== 'location') {
                return { key: typePropertyKey, label, val, type };
            } else {
                return [
                    { key: typePropertyKey + '_lat', label: 'Latitude', val: val.coordinates[0], type },
                    { key: typePropertyKey + '_lng', label: 'Longitude', val: val.coordinates[1], type }
                ]
            }
        });

    const [shownValues, setShownValues] = useState(savedValues);

    const changedValues = shownValues.filter(({ val }, i) => (savedValues[i].val + '').trim() !== (val + '').trim());
    const allSame = changedValues.length === 0;

    const handleSaveEntityProperties = () => {

        // Saving values except for location
        const changedValuesNonLoc = changedValues.filter(({ type }) => type !== 'location');
        if (changedValuesNonLoc.length > 0) {
            const propertiesChanged = changedValuesNonLoc.map(({ key, val }) => { return { key, val } });
            setEntityProperties(entityItem.key, entityType.key, propertiesChanged);
        }

        // Saving just the location
        const changedValuesLoc = changedValues.filter(({ type }) => type === 'location');
        if (changedValuesLoc.length > 0) {
            // find the location property, we assume it exists because it is on the map
            const locationPropType = entityType.properties.find(({ type }) => type === 'location');
            const locationProp = entityItem.properties.find(({ key }) => key === locationPropType.key);

            // create new coordinates
            const coordinates = [...locationProp.val.coordinates];
            for (const { key, val } of changedValuesLoc) {
                const index = key.endsWith('_lat') ? 0 : 1;
                coordinates[index] = parseFloat(val);
            }

            debugger
            // changing the location
            const locationChanged = [{ coordinates, ...locationProp.val }];
            console.log(locationChanged)
            setEntityLocations([entityItem.key], 'OSMMap', [coordinates]); // TODO get layerChosen
        }

        setIsEditLocation(false);
    }

    return (
        <>
            <Typography variant='h6'>
                {entityItem.name}
            </Typography>
            {
                isEditLocation
                    ? null
                    : <>
                        <Typography variant='overline'>
                            {'at (' + devLocation.map(x => Math.round(x * 1e7) / 1e7) + ')'}
                        </Typography>
                        <ButtonTooltip tooltip={'Edit location'} onClick={() => setIsEditLocation(true)}>
                            <PenIcon />
                        </ButtonTooltip>
                    </>
            }
            <Grid container
                direction='column'
                spacing={1}
            >
                {
                    shownValues
                        .filter(({ type }) => isEditLocation ? true : type !== 'location')
                        .map(({ key: propertyKey, label, val }) => (
                            <Grid item
                                key={propertyKey}
                            >
                                <TextField
                                    key={propertyKey}
                                    variant='outlined'
                                    label={label}
                                    size='small'
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(e) => {
                                        setShownValues(shownValues.map((t) => {
                                            if (t.key === propertyKey) {
                                                return { ...t, val: e.target.value };
                                            }
                                            return t;
                                        }));
                                    }}
                                    value={val + ''}
                                />
                            </Grid>
                        ))
                }
            </Grid>
            <ButtonTooltip
                key='check'
                color='primary'
                disabled={allSame}
                tooltip={'Save entity properties'}
                onClick={() => handleSaveEntityProperties()}
            >
                <Check />
            </ButtonTooltip>
            <ButtonTooltip
                key='close'
                color='secondary'
                disabled={allSame}
                tooltip={'Revert entity properties'}
                onClick={() => { setShownValues(savedValues); setIsEditLocation(false); }}
            >
                <Close />
            </ButtonTooltip>
        </>
    )
}