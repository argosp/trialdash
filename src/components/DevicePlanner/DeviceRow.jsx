import { IconButton, ListItem, ListItemText } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React from 'react';

export const DeviceRow = ({ dev, devLocation, isSelected, onClick, onDisableLocation }) => (
    <ListItem
        key={dev.name}
        button
        selected={isSelected}
        onClick={onClick}
    >
        <ListItemText primary={dev.name} />
        {!devLocation ? null :
            <IconButton aria-label="Disable location" size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    onDisableLocation();
                }}
            >
                <LocationOnIcon />
            </IconButton>
        }
    </ListItem>
)
