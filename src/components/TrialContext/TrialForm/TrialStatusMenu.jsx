import {
    Grid,
    Menu,
    MenuItem
} from '@mui/material';
import classnames from 'classnames';
import { COLORS_STATUSES } from '../../../constants/base';
import StatusBadge from '../../StatusBadge';
import { PenIcon } from '../../../constants/icons';
import { compose } from 'recompose';
import { withStyles } from '@mui/styles';
import { styles } from './styles';

export const TrialStatusMenu = compose(
    withStyles(styles, { withTheme: true }),
)(({
    theme,
    classes,
    trialStatus,
    setTrialStatus,
    onInputChange,
    trial,
}) => {
    return (
        <>
            <StatusBadge
                onClick={(e) => setTrialStatus({ ...trialStatus, anchorMenu: e.currentTarget })}
                onMouseEnter={(e) => setTrialStatus({ ...trialStatus, editableStatus: true })}
                onMouseLeave={(e) => setTrialStatus({ ...trialStatus, editableStatus: false })}
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
                        {trialStatus.editableStatus && <PenIcon className={classes.penIcon} />}
                    </Grid>
                }
                color={theme.palette[COLORS_STATUSES[trial.status].color][COLORS_STATUSES[trial.status].level]}
            />
            <Menu
                onMouseEnter={(e) => setTrialStatus({ ...trialStatus, editableStatus: true })}
                onMouseLeave={(e) => setTrialStatus({ ...trialStatus, editableStatus: false })}
                id="statuses-menu"
                classes={{ paper: classes.menu }}
                open={Boolean(trialStatus.anchorMenu)}
                onClose={() => setTrialStatus({ anchorMenu: null, editableStatus: false })}
                anchorEl={trialStatus.anchorMenu}
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
                {Object.keys(COLORS_STATUSES).map((i) => (
                    <MenuItem
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
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
})