import { IconButton, ListItem, ListItemText } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React from 'react';

export const DeviceRow = ({ dev, deviceLocation, isDeviceOnLayer, isSelected, onClick, onDisableLocation }) => (
    <ListItem
        key={dev.name}
        button
        selected={isSelected}
        onClick={onClick}
    >
        <ListItemText primary={dev.name} />
        {!deviceLocation ? null :
            <IconButton aria-label="Disable location" size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    onDisableLocation();
                }}
            >
                <LocationOnIcon color={isDeviceOnLayer ? "primary" : ""} />
            </IconButton>
        }
    </ListItem>
)
