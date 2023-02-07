import React from 'react';
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
    return (
        <Grid container
            direction='column'
            spacing={1}
        >
            {
                entityType.properties
                    .filter(({ type }) => type !== 'location')
                    .map(({ key, label, defaultValue }) => {
                        const valprop = entityItem.properties.find(({ k }) => k === key);
                        const val = valprop ? valprop.val : defaultValue;
                        return (
                            <Grid item>
                                <TextField
                                    key={key}
                                    variant='outlined'
                                    label={label}
                                    size='small'
                                    InputLabelProps={{ shrink: true }}
                                >
                                    {val + ''}
                                </TextField>
                            </Grid>
                        )
                    })
            }
            <Grid item>
                <IconButton color='primary' size="small">
                    <Check />
                </IconButton>
                <IconButton color='secondary' size="small">
                    <Close />
                </IconButton>
            </Grid>
        </Grid>
    )
}