import React from 'react';
import {
    IconButton,
    Tooltip,
} from '@material-ui/core';
import { DomEvent } from 'leaflet';

export const ButtonTooltip = ({ onClick, tooltip, children }) => {
    return (
        <Tooltip title={tooltip}>
            <IconButton size="small" onClick={(e) => {
                DomEvent.stop(e);
                onClick(e)
            }}>
                {children}
            </IconButton>
        </Tooltip>
    )
}

