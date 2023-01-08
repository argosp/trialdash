import React from 'react';
import { ListItem, ListItemText } from '@material-ui/core';

export const EntityRow = ({ dev, isSelected, onClick, children }) => {
    return (
        <ListItem
            key={dev.name}
            button
            selected={isSelected}
            onClick={onClick}
        >
            <ListItemText primary={dev.name} />
            {children}
        </ListItem>
    )
}