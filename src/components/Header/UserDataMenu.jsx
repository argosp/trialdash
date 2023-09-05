import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { UserData } from "./UserData"
import { useState } from 'react';

export const UserDataMenu = ({ classes, history }) => {
    const [anchorEl, setAnchorEl] = useState();
    return (
        <div className={classes.profileWrapper}>
            <UserData
                classes={classes}
                handleProfileMenuClick={(event) => setAnchorEl(event.currentTarget)}
            />
            <Menu
                id="profile-menu"
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={() => {
                    localStorage.clear();
                    history.push('/login');
                }}>
                    Log out
                </MenuItem>
            </Menu>
        </div>

    )
}