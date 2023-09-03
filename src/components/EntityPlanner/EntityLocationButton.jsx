import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ContextMenu } from './ContextMenu';

export const EntityLocationButton = ({ entityLocation, isEntityOnLayer, entityLayerName, onDisableLocation, menuItems }) => {
    let tip = entityLocation.map(x => Math.round(x * 1e5) / 1e5).join(', ');
    if (!isEntityOnLayer) {
        tip = '(' + tip + ') on ' + entityLayerName;
    }
    return (
        <>
            <ContextMenu
                menuItems={menuItems}
                child={
                    <Tooltip title={tip}                >
                        <IconButton aria-label="Disable location" size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onDisableLocation(e.shiftKey);
                            }}
                        >
                            <LocationOnIcon color={isEntityOnLayer ? "primary" : "inherit"} />
                        </IconButton>
                    </Tooltip>
                }
            >
            </ContextMenu>
        </>
    );
};