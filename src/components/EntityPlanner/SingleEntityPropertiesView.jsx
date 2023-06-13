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
    const { setEntityProperties } = useEntities();
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
        const propertiesChanged = [];
        for (let {key, val, type} of changedValues) {
            propertiesChanged.push({ key, val });
        }
        setEntityProperties(entityItem.key, entityType.key, propertiesChanged);
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
                        {/* <ButtonTooltip tooltip={'Edit location'} onClick={() => setIsEditLocation(true)}>
                            <PenIcon />
                        </ButtonTooltip> */}
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
                onClick={() => setShownValues(savedValues)}
            >
                <Close />
            </ButtonTooltip>
        </>
    )
}