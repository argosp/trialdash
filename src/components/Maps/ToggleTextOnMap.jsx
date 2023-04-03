import React from 'react';
import {
    Paper,
    Button,
} from '@material-ui/core';
import Control from './lib/react-leaflet-custom-control.jsx';

export const ToggleTextOnMap = ({ position, value, setValue, name }) => {
    return (
        <Control position={position} >
            <Paper>
                <Button
                    variant={value ? 'contained' : 'outlined'}
                    color={'primary'}
                    onClick={() => {
                        setValue(!value);
                    }}
                >
                    {name}
                </Button>
            </Paper>
        </Control>
    )
}