import {
    Grid,
    Menu,
    MenuItem
} from '@mui/material';
import classnames from 'classnames';
import { COLORS_STATUSES } from '../../../constants/base';

export const TrialStatusMenu = ({ setEditableStatus, classes, anchorMenu, handleMenuClose, onInputChange }) => {
    return (
        <Menu
            onMouseEnter={() => setEditableStatus(true)}
            onMouseLeave={() => setEditableStatus(false)}
            id="statuses-menu"
            classes={{ paper: classes.menu }}
            open={Boolean(anchorMenu)}
            onClose={() => handleMenuClose('anchorMenu')}
            anchorEl={anchorMenu}
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
            {Object.keys(COLORS_STATUSES).map((i) => <MenuItem
                key={i}
                classes={{ root: classes.menuItem }}
                onClick={e => onInputChange({ target: { value: i } }, 'status')}
            >
                <Grid
                    container
                    wrap="nowrap"
                    alignItems="center"
                >
                    <div className={(classnames(classes.rect, classes[i]))}></div>
                    {i}
                </Grid>
            </MenuItem>)}
        </Menu>
    );
}