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
import { useEntities } from './EntitiesContext.jsx';
import { ButtonTooltip } from './ButtonTooltip.jsx';

export const SingleEntityPropertiesView = ({ entityType, entityItem, devLocation }) => {
    const { setEntityProperties } = useEntities();
    const [isEditLocation, setIsEditLocation] = useState(false);

    const savedValues = entityType.properties.filter(({ type }) => type !== 'location')
        .map(({ key: typePropertyKey, label, defaultValue }) => {
            const valprop = entityItem.properties.find(({ key: itemPropertyKey }) => itemPropertyKey === typePropertyKey);
            let val = '';
            if (valprop && valprop.val !== undefined && valprop.val !== null) {
                val = valprop.val;
            } else if (defaultValue !== null && defaultValue !== undefined) {
                val = defaultValue;
            }
            return { key: typePropertyKey, label, val };
        });

    const [shownValues, setShownValues] = useState(savedValues);

    const changedValues = shownValues.filter(({ val }, i) => (savedValues[i].val + '').trim() !== (val + '').trim());
    const allSame = changedValues.length === 0;

    return (
        <>
            <Typography variant='h6'>
                {entityItem.name}
            </Typography>
            <Typography variant='overline'>
                {'at (' + devLocation.map(x => Math.round(x * 1e7) / 1e7) + ')'}
            </Typography>
            <Grid container
                direction='column'
                spacing={1}
            >
                {
                    shownValues.map(({ key: propertyKey, label, val }, i) => (
                        <Grid item
                            key={i}
                        >
                            <TextField
                                key={propertyKey}
                                variant='outlined'
                                label={label}
                                size='small'
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => {
                                    setShownValues(shownValues.map((t, j) => {
                                        if (j === i) {
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
                onClick={() => {
                    const propertiesChanged = changedValues.map(({ key, val }) => { return { key, val } });
                    setEntityProperties(entityItem.key, entityType.key, propertiesChanged);
                }}
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