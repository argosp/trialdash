import React, { useState } from 'react';
import {
    IconButton,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
} from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close";
import SimpleButton from '../SimpleButton';

export const ButtonWithDialog = ({ title, titleButton, iconButton, children, postContent }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Paper>
                {iconButton
                    ? <IconButton
                        onClick={() => setOpen(true)}
                    >
                        {iconButton}
                    </IconButton>
                    : <Button
                        variant={'outlined'} 
                        color={'primary'}
                        onClick={() => setOpen(true)}
                    >
                        {titleButton && titleButton !== '' ? titleButton : title}
                    </Button>
                }
            </Paper>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle
                    id="customized-dialog-title"
                    style={{ display: "flex", justifyContent: "space-between" }}
                    disableTypography
                >
                    <Typography variant="h6">
                        {title}
                    </Typography>
                    <IconButton
                        size='small'
                        onClick={() => setOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {children}
                </DialogContent>
                {postContent}
            </Dialog>
        </>
    )
}