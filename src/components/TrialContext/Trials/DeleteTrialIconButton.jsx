import React, { useState } from 'react';
import { BasketIcon } from '../../../constants/icons';
import ConfirmDialog from '../../ConfirmDialog';
import CustomTooltip from '../../CustomTooltip';

export const DeleteTrialIconButton = ({ trial, deleteTrial }) => {
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    return (
        <>
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
        </>
    )
}