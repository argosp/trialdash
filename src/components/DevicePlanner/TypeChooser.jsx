import { InputLabel, MenuItem, Select, Switch } from '@material-ui/core';
import React from 'react';

export const TypeChooser = ({ selectedType, onChange, showAll, setShowAll, typeOptions }) => (
    <div style={{ width: '100%' }}>
        <div style={{ display: 'inline-block', verticalAlign: 'text-top', margin: 5 }}>
            <InputLabel id="show-all-types" style={{ fontSize: 10 }}>Show all</InputLabel>
            <Switch id="show-all-types" color="primary" inputProps={{ 'aria-label': 'primary checkbox' }}
                value={showAll}
                onChange={e => setShowAll(e.target.checked)}
            />
        </div>
        <div style={{ display: 'inline-block', verticalAlign: 'text-top', margin: 5 }}>
            <InputLabel id="select-type" style={{ fontSize: 10 }}>Device Type</InputLabel>
            <Select
                id="select-type"
                value={selectedType}
                onChange={e => onChange(e.target.value)}
            >
                {
                    typeOptions.map(opt => (
                        <MenuItem key={opt.name} value={opt.name}>
                            {opt.name}
                        </MenuItem>
                    ))
                }
            </Select>
        </div>
    </div>
)