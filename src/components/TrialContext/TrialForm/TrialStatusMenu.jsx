import {
    Grid,
    Menu,
    MenuItem
} from '@mui/material';
import classnames from 'classnames';
import { COLORS_STATUSES } from '../../../constants/base';
import StatusBadge from '../../StatusBadge';
import { PenIcon } from '../../../constants/icons';

export const TrialStatusMenu = ({ theme, setEditableStatus, classes, anchorMenu, setAnchorMenu, handleMenuClose, onInputChange, trial, editableStatus }) => {
    return (
        <>
            <StatusBadge
                onClick={(e) => setAnchorMenu(e.currentTarget)}
                onMouseEnter={() => setEditableStatus(true)}
                onMouseLeave={() => setEditableStatus(false)}
                className={classes.statusBadge}
                title={
                    <Grid
                        container
                        wrap="nowrap"
                        justifyContent="space-between"
                        alignItems="center"
                        alignContent="space-between"
                    >
                        <span>{trial.status}</span>
                        {editableStatus && <PenIcon className={classes.penIcon} />}
                    </Grid>
                }
                color={theme.palette[COLORS_STATUSES[trial.status].color][COLORS_STATUSES[trial.status].level]}
            />
            <Menu
                onMouseEnter={() => setEditableStatus(true)}
                onMouseLeave={() => setEditableStatus(false)}
                id="statuses-menu"
                classes={{ paper: classes.menu }}
                open={Boolean(anchorMenu)}
                onClose={() => handleMenuClose()}
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
        </>
    );
}