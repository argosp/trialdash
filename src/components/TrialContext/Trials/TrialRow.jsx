import React, { useState } from 'react';
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
    classes,
    theme,
    client,
    match,
    activateEditMode,
    updateTrialFromCsv,
    updateEntitiesTrialFromCsv,
    deleteTrial,
    cloneTrial,
}) => {
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

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
                        displayCloneData
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
                    onClick={e => setAnchorEl(e.currentTarget)}
                >
                    <CloneIcon />
                </CustomTooltip>
                {<Menu
                    id="clone-menu"
                    classes={{ paper: classes.menu }}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    {['design', 'deploy'].map((destType) => (
                        <MenuItem
                            color={theme.palette[trial.status === 'deploy' ? 'orange' : 'violet'].main}
                            key={uuid()}
                            classes={{ root: classes.menuItem }}
                            onClick={() => cloneTrial(destType, trial)}
                        >
                            <Grid
                                container
                                wrap="nowrap"
                                alignItems="center"
                            >
                                <div className={(classnames(classes.rect, classes[destType]))}></div>
                                {destType}
                            </Grid>
                        </MenuItem>
                    ))}
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
                    onClick={() => setConfirmDeleteOpen(true)}
                >
                    <BasketIcon />
                </CustomTooltip>
                <ConfirmDialog
                    title={'Delete Trial ' + trial.name}
                    open={confirmDeleteOpen}
                    setOpen={setConfirmDeleteOpen}
                    onConfirm={() => deleteTrial(trial)}
                >
                    Are you sure you want to delete this trial?
                </ConfirmDialog>
            </StyledTableCell>
        </>
    )
}