import React from 'react';
import { TextField } from '@mui/material';

export const InlineProperties = ({ trialSet, trial }) => {
    return trialSet && trialSet.properties && trialSet.properties.map(property => {
        const trialProp = trial.properties.find(p => p.key === property.key);
        const val = trialProp && trialProp.val !== null && trialProp.val !== undefined ? trialProp.val : '';
        const label = property.label;
        return (
            <TextField
                key={property.key}
                label={label}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    readOnly: true,
                    style: {
                        width: Math.max(100, 12 * (val + '').length) + 'px'
                    }
                }}
                variant={'outlined'}
                value={val}
                size={'small'}
                style={{
                    margin: '10px',
                }}
            >
            </TextField>
        )
    })
}