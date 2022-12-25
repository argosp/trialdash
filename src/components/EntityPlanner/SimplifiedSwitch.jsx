import React from 'react';
import { InputLabel, Switch } from '@material-ui/core';

export const SimplifiedSwitch = ({ label, value, setValue }) => (
    <div style={{ display: 'inline-block', margin: 5 }}>
        <InputLabel style={{ fontSize: 10 }}>{label}</InputLabel>
        <Switch color="primary" inputProps={{ 'aria-label': 'primary checkbox' }}
            value={value}
            onChange={e => setValue(e.target.checked)}
        />
    </div>
)

