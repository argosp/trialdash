import React from 'react';
import { Paper, TextField } from '@material-ui/core';

export const JsonStreamer = ({ json, onChange }) => (
    <Paper
        style={{
            position: 'absolute', maxHeight: '10%', overflow: 'auto',
            height: '10%', width: '30%', left: 0, bottom: 0,
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}
    >
        <TextField
            id="outlined-multiline-static"
            // label="Json"
            multiline
            // rows="10"
            // variant={"outlined"}
            style={{
                position: 'absolute', overflow: 'scroll',
                top: 10, bottom: 10, right: 10, left: 10
                // , justifyContent: 'center'

            }}
            inputProps={{ style: { fontSize: 10, lineHeight: 1 } }}
            value={JSON.stringify(json, null, 2)}
            onChange={e => onChange(JSON.parse(e.target.value))}
        />
    </Paper>
)