import { IconButton, ListItem, ListItemText, Tooltip, Menu, MenuItem } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React from 'react';

const EntityLocationButton = ({ entityLocation, isEntityOnLayer, entityLayerName, onDisableLocation }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    let tip = entityLocation.map(x => Math.round(x * 1e5) / 1e5).join(', ');
    if (!isEntityOnLayer) {
        tip = '(' + tip + ') on ' + entityLayerName;
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    onDisableLocation(true);
                    handleClose();
                }}>
                    Remove all (shift+click)
                </MenuItem>
                <MenuItem onClick={() => {
                    onDisableLocation(false);
                    handleClose();
                }}>
                    Remove this one (click)
                </MenuItem>
                <MenuItem onClick={handleClose}>Cancel</MenuItem>
            </Menu>
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
                        setAnchorEl(e.currentTarget);
                    }}
                >
                    <LocationOnIcon color={isEntityOnLayer ? "primary" : "inherit"} />
                </IconButton>
            </Tooltip>
        </>
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