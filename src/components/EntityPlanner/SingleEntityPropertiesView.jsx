import React, { useState } from 'react';
import {
    Grid,
    TextField,
    IconButton,
} from '@material-ui/core';
import {
    Check,
    Close,
} from "@material-ui/icons";
import { useEntities } from './EntitiesContext.jsx';

export const SingleEntityPropertiesView = ({ entityType, entityItem }) => {
    const { setEntityProperties } = useEntities();

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
            <Grid item key='buttons'>
                <IconButton
                    key='check'
                    color='primary'
                    size="small"
                    disabled={allSame}
                    onClick={() => {
                        const propertiesChanged = changedValues.map(({ key, val }) => { return { key, val } });
                        setEntityProperties(entityItem.key, entityType.key, propertiesChanged);
                    }}
                >
                    <Check />
                </IconButton>
                <IconButton
                    key='close'
                    color='secondary'
                    size="small"
                    disabled={allSame}
                    onClick={() => setShownValues(savedValues)}
                >
                    <Close />
                </IconButton>
            </Grid>
        </Grid>
    )
}