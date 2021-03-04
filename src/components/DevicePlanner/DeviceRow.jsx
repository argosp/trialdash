import { IconButton, ListItem, ListItemText, Tooltip } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React from 'react';

const formatDeviceLocation = (loc, layer) => {
    return;
}

export const DeviceRow = ({ dev, deviceLocation, isDeviceOnLayer, deviceLayerName, isSelected, onClick, onDisableLocation }) => {
    let tip = null;
    if (deviceLocation) {
        tip = deviceLocation.map(x => Math.round(x * 1e5) / 1e5).join(', ');
        if (!isDeviceOnLayer) {
            tip = '(' + tip + ') on ' + deviceLayerName;
        }
    }
    return (
        <ListItem
            key={dev.name}
            button
            selected={isSelected}
            onClick={onClick}
        >
            <ListItemText primary={dev.name} />
            {!deviceLocation ? null :
                <Tooltip title={tip}>
                    <IconButton aria-label="Disable location" size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDisableLocation();
                        }}
                    >
                        <LocationOnIcon color={isDeviceOnLayer ? "primary" : "inherit"} />
                    </IconButton>
                </Tooltip>
            }
        </ListItem>
    )
}