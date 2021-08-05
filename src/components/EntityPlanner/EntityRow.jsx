import { IconButton, ListItem, ListItemText, Tooltip } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React from 'react';

const formatEntityLocation = (loc, layer) => {
    return;
}

const EntityLocationButton = ({ entityLocation, isEntityOnLayer, entityLayerName, onDisableLocation }) => {
    let tip = entityLocation.map(x => Math.round(x * 1e5) / 1e5).join(', ');
    if (!isEntityOnLayer) {
        tip = '(' + tip + ') on ' + entityLayerName;
    }
    return (
        <Tooltip title={tip}>
            <IconButton aria-label="Disable location" size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDisableLocation(e.shiftKey);
                }}
                onContextMenu={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log(e);
                }}
            >
                <LocationOnIcon color={isEntityOnLayer ? "primary" : "inherit"} />
            </IconButton>
        </Tooltip>
    );
};

export const EntityRow = ({ dev, entityLocation, isEntityOnLayer, entityLayerName, isSelected, onClick, onDisableLocation }) => {
    return (
        <ListItem
            key={dev.name}
            button
            selected={isSelected}
            onClick={onClick}
        >
            <ListItemText primary={dev.name} />
            {!entityLocation ? null :
                <EntityLocationButton
                    entityLocation={entityLocation}
                    isEntityOnLayer={isEntityOnLayer}
                    entityLayerName={entityLayerName}
                    onDisableLocation={onDisableLocation}
                />
            }
        </ListItem>
    )
}