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

export const SingleEntityPropertiesView = ({ entityType, entityItem }) => {
    const savedValues = entityType.properties.filter(({ type }) => type !== 'location')
        .map(({ key, label, defaultValue }) => {
            const valprop = entityItem.properties.find(({ k }) => k === key);
            const val = valprop ? valprop.val : defaultValue;
            return { key, label, val };
        });

    const [shownValues, setShownValues] = useState(savedValues);

    const allSame = shownValues.find(({ val }, i) => (savedValues[i].val + '').trim() !== (val + '').trim()) === undefined;

    return (
        <Grid container
            direction='column'
            spacing={1}
        >
            {
                shownValues.map(({ key, label, val }, i) => (
                    <Grid item>
                        <TextField
                            key={key}
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
            <Grid item>
                <IconButton color='primary' size="small" disabled={allSame}>
                    <Check />
                </IconButton>
                <IconButton color='secondary' size="small" disabled={allSame}
                    onClick={() => setShownValues(savedValues)}
                >
                    <Close />
                </IconButton>
            </Grid>
        </Grid>
    )
}