import React from 'react';
import moment from 'moment';
import { AttachFile, UploadIcon, GridIcon, PenIcon, DownloadIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import StatusBadge from '../../StatusBadge';
import StyledTableCell from '../../StyledTableCell';
import { InlineProperties } from './InlineProperties';
import { downloadTrial } from './downloadCsv';
import { displayCloneData } from './trialUtils';
import { DeleteTrialIconButton } from './DeleteTrialIconButton';
import { CloneTrialIconButton } from './CloneTrialIconButton';
import { COLORS_STATUSES } from '../../../constants/base';

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
                <StatusBadge color={theme.palette[COLORS_STATUSES[trial.status].color].main} title={trial.status} />
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
                <CloneTrialIconButton
                    classes={classes}
                    cloneTrial={cloneTrial}
                    theme={theme}
                    trial={trial}
                />
                <CustomTooltip
                    title="Edit"
                    ariaLabel="edit"
                    onClick={() => activateEditMode(trial)}
                >
                    <PenIcon />
                </CustomTooltip>
                <DeleteTrialIconButton
                    trial={trial}
                    deleteTrial={deleteTrial}
                />
            </StyledTableCell>
        </>
    )
}