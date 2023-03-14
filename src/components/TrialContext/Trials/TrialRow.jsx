import React from 'react';
import uuid from 'uuid/v4';
import moment from 'moment';
import { Grid, Menu, MenuItem } from '@material-ui/core';
import { AttachFile, UploadIcon, CloneIcon, GridIcon, PenIcon, BasketIcon, DownloadIcon } from '../../../constants/icons';
import classnames from 'classnames';
import CustomTooltip from '../../CustomTooltip';
import StatusBadge from '../../StatusBadge';
import StyledTableCell from '../../StyledTableCell';
import { InlineProperties } from './InlineProperties';
import ConfirmDialog from '../../ConfirmDialog';
import { downloadTrial } from './downloadCsv';
import { displayCloneData } from './trialUtils';

export const TrialRow = ({
    trial,
    trialsArray,
    trialSet,
    confirmOpen,
    anchorMenu,
    classes,
    theme,
    client,
    match,
    activateEditMode,
    updateTrialFromCsv,
    updateEntitiesTrialFromCsv,
    currentTrial,
    deleteTrial,
    handleMenuClick,
    handleMenuClose,
    onInputChange,
    setConfirmOpen
}) => {
    return (
        <>
            <StyledTableCell align="left" className={classes.tableCell}
                onClick={() => activateEditMode(trial)}
            >
                {trial.name}
            </StyledTableCell>
            <StyledTableCell align="left">
                {trial.cloneFrom ? displayCloneData(trial, trialsArray) : ''}
            </StyledTableCell>
            <StyledTableCell align="left">
                {trial.numberOfEntities}
            </StyledTableCell>
            <StyledTableCell align="left">
                <InlineProperties
                    trialSet={trialSet}
                    trial={trial}
                />
            </StyledTableCell>
            <StyledTableCell align="left">
                {moment(trial.created).format('D/M/YYYY')}
            </StyledTableCell>
            <StyledTableCell align="left">
                <StatusBadge color={theme.palette[trial.status === 'deploy' ? 'orange' : 'violet'].main} title={trial.status} />
            </StyledTableCell>
            <StyledTableCell align="right"
                className={classes.actionsCell}
                style={{ display: 'table-cell' }}
            >
                <CustomTooltip
                    title="Download"
                    ariaLabel="download"
                    onClick={() => downloadTrial({
                        client,
                        match,
                        trial,
                        trials: trialsArray,
                        trialSet,
                        displayCloneData: displayCloneData
                    })}
                >
                    <DownloadIcon />
                </CustomTooltip>
                <CustomTooltip
                    title="Upload csv props update"
                    ariaLabel="Upload csv update"
                    component="label"
                >
                    <>
                        <UploadIcon />
                        <input
                            type="file"
                            onChange={updateTrialFromCsv}
                            hidden
                        />
                    </>
                </CustomTooltip>
                <CustomTooltip
                    title="Upload csv entities update"
                    ariaLabel="Upload csv update"
                    component="label"
                >
                    <>
                        <AttachFile />
                        <input
                            type="file"
                            onChange={(e) => updateEntitiesTrialFromCsv(e, trial)}
                            hidden
                        /></>

                </CustomTooltip>
                <CustomTooltip
                    title="Entities"
                    ariaLabel="entities"
                    onClick={() => activateEditMode(trial, true)}
                >
                    <GridIcon />
                </CustomTooltip>
                <CustomTooltip
                    title="Clone from"
                    ariaLabel="clone"
                    onClick={(e) => handleMenuClick(e, trial)}
                >
                    <CloneIcon />
                </CustomTooltip>
                {currentTrial && <Menu
                    id="clone-menu"
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
                    {['design', 'deploy'].map((i) => <MenuItem
                        color={theme.palette[currentTrial.status === 'deploy' ? 'orange' : 'violet'].main}
                        key={uuid()}
                        classes={{ root: classes.menuItem }}
                        onClick={e => onInputChange({ target: { value: i } })}
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
                </Menu>}
                <CustomTooltip
                    title="Edit"
                    ariaLabel="edit"
                    onClick={() => activateEditMode(trial)}
                >
                    <PenIcon />
                </CustomTooltip>
                <CustomTooltip
                    title="Delete"
                    ariaLabel="delete"
                    onClick={() => setConfirmOpen(true, trial)}
                >
                    <BasketIcon />
                </CustomTooltip>
                <ConfirmDialog
                    title={'Delete Trial'}
                    open={confirmOpen}
                    setOpen={setConfirmOpen}
                    onConfirm={() => deleteTrial()}
                // inputValidation
                >
                    Are you sure you want to delete this trial?
                </ConfirmDialog>
            </StyledTableCell>
        </>
    )
}