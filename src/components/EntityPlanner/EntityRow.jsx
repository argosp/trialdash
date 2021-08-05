import { IconButton, ListItem, ListItemText, Tooltip } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React from 'react';

const formatEntityLocation = (loc, layer) => {
    return;
}

export const EntityRow = ({ dev, entityLocation, isEntityOnLayer, entityLayerName, isSelected, onClick, onDisableLocation }) => {
    let tip = null;
    if (entityLocation) {
        tip = entityLocation.map(x => Math.round(x * 1e5) / 1e5).join(', ');
        if (!isEntityOnLayer) {
            tip = '(' + tip + ') on ' + entityLayerName;
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
            {!entityLocation ? null :
                <Tooltip title={tip}>
                    <IconButton aria-label="Disable location" size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDisableLocation(e.shiftKey);
                        }}
                    >
                        <LocationOnIcon color={isEntityOnLayer ? "primary" : "inherit"} />
                    </IconButton>
                </Tooltip>
            }
        </ListItem>
    )
}