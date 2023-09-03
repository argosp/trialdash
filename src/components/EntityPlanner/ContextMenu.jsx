import React from 'react';
import { Menu, MenuItem } from '@mui/material';

export const ContextMenu = ({ menuItems, child }) => {
    const [menuAnchorElement, setMenuAnchorElement] = React.useState(null);

    const handleClose = () => {
        setMenuAnchorElement(null);
    };

    return (
        <>
            <Menu
                id="simple-menu"
                anchorEl={menuAnchorElement}
                keepMounted
                open={Boolean(menuAnchorElement)}
                onClose={handleClose}
            >
                {
                    menuItems.map(({ label, callback }) => (
                        <MenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                callback(e);
                                handleClose();
                            }}
                            key={label}
                        >
                            {label}
                        </MenuItem>
                    ))
                }
                <MenuItem onClick={handleClose}>Cancel</MenuItem>
            </Menu>
            <div
                onContextMenu={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setMenuAnchorElement(e.currentTarget);
                }}
            >
                {child}
            </div>
        </>
    )
}

