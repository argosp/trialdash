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
import ConfirmDialog from '../../ConfirmDialog';

export const TrialStatusMenu = compose(
    withStyles(styles, { withTheme: true }),
)(({
    theme,
    classes,
    trialStatus,
    setTrialStatus,
    trial,
    submitTrial,
}) => {

    const {
        anchorMenu,
        editableStatus,
        confirmStatusOpen,
        newStatus,
    } = trialStatus;
    const setState = (partialTrialStatus) => {
        setTrialStatus({ ...trialStatus, ...partialTrialStatus });
    }

    return (
        <>
            <StatusBadge
                onClick={(e) => setState({ anchorMenu: e.currentTarget })}
                onMouseEnter={(e) => setState({ editableStatus: true })}
                onMouseLeave={(e) => setState({ editableStatus: false })}
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
                onMouseEnter={(e) => setState({ editableStatus: true })}
                onMouseLeave={(e) => setState({ editableStatus: false })}
                id="statuses-menu"
                classes={{ paper: classes.menu }}
                open={Boolean(anchorMenu)}
                onClose={() => setState({ anchorMenu: null, editableStatus: false })}
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
                {Object.keys(COLORS_STATUSES).map((i) => (
                    <MenuItem
                        key={i}
                        classes={{ root: classes.menuItem }}
                        onClick={e => {
                            if (i !== trial.status) {
                                setState({
                                    editableStatus: false,
                                    anchorMenu: null,
                                    confirmStatusOpen: true,
                                    newStatus: i
                                });
                            }
                        }}
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
            <ConfirmDialog
                title={'You are going to change trial status'}
                open={confirmStatusOpen}
                confirmText="Save changes and change status"
                onConfirm={() => submitTrial(trial, newStatus)}
                cancelText="I don't want to change status"
                onCancel={() => setState({ confirmStatusOpen: false })}
                cancelColor="#474747"
            >
                You have to save your changes before
            </ConfirmDialog>
        </>
    );
})