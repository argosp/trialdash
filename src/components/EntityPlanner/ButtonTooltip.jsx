import React from 'react';
import {
    IconButton,
    Tooltip,
} from '@material-ui/core';
import { DomEvent } from 'leaflet';

export const ButtonTooltip = ({ onClick, tooltip, disabled, children, ...restProps }) => {
    const button = (
        <IconButton
            size="small"
            onClick={(e) => {
                DomEvent.stop(e);
                onClick(e)
            }}
            disabled={disabled}
            {...restProps}
        >
            {children}
        </IconButton>
    );
    if (disabled) {
        return button;
    } else {
        return (
            <Tooltip title={tooltip}>
                {button}
            </Tooltip>
        )
    }
}

