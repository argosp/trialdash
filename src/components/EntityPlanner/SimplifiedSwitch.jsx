import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';

export const SimplifiedSwitch = ({ label, value, setValue }) => (
    <FormControlLabel
        control={
            <Checkbox
                color="primary"
                checked={value}
                onChange={e => setValue(e.target.checked)}
                size='small'
            />
        }
        label={label}
        componentsProps={{ typography: { variant: 'h5' } }}
    />
)