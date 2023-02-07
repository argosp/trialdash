import React from 'react';
import {
    Grid,
    Typography,
} from '@material-ui/core';

export const SingleEntityPropertiesView = ({ entityType, entityItem }) => {
    return (
        <Grid container direction='column'>
            {
                entityType.properties
                    .filter(({ type }) => type !== 'location')
                    .map(({ key, label, defaultValue }) => {
                        const valprop = entityItem.properties.find(({ k }) => k === key);
                        const val = valprop ? valprop.val : defaultValue;
                        return (
                            <Grid item>
                                <Grid container direction='row' spacing={1} justifyContent="space-between" alignItems="stretch">
                                    <Grid item>
                                        <Typography key={key} variant='body2'>
                                            {label}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography key={key + '_val'} variant='body2'>
                                            {val}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )
                    })
            }
        </Grid>
    )
}