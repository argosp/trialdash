import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { UserData } from "./UserData"
import { useState } from 'react';

export const UserDataMenu = ({ classes, history }) => {
    const [anchorProfileMenu, setAnchorProfileMenu] = useState();
    return (
        <div className={classes.profileWrapper}>
            <UserData
                classes={classes}
                handleProfileMenuClick={(event) => setAnchorProfileMenu(event.currentTarget)}
            />
            <Menu
                id="profile-menu"
                open={Boolean(anchorProfileMenu)}
                onClose={() => setAnchorProfileMenu(null)}
                anchorEl={anchorProfileMenu}
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