import React from 'react';
import { InputLabel, Slider } from '@material-ui/core';

export const InputSlider = ({ text, value, setValue }) => (
    <div style={{ display: 'block' }}>
        <div style={{ display: 'inline-block', margin: 5, width: '40%' }}>
            <InputLabel style={{ fontSize: 10 }}>{text}</InputLabel>
            <Slider
                onChange={(e, v) => setValue(v)}
                value={value}
                defaultValue={3}
                valueLabelDisplay="auto"
                min={2}
                max={20}
            />
        </div>
    </div>
)