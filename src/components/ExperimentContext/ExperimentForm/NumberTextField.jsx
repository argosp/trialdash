import React, { useState, useEffect, useRef } from "react";
import {
    TextField
} from '@material-ui/core';
import { DebounceInput } from 'react-debounce-input';

export const NumberTextField = ({ value, onChange, label }) => (
    <DebounceInput
        value={value}
        onChange={(e) => {
            const num = parseFloat(e.target.value);
            if (!isNaN(num)) {
                onChange(num);
            }
        }}
        style={{ width: '120px' }}
        variant="outlined"
        label={label}
        minLength={2}
        debounceTimeout={500}
        element={TextField}
    />
)
