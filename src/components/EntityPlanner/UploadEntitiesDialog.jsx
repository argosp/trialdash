import React, { useRef, useState } from 'react';
import {
    Box,
    Button,
    RadioGroup,
    Radio,
    FormControlLabel,
    IconButton,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from "@material-ui/icons/Close";
import { downloadEntities } from '../TrialContext/Trials/downloadCsv';
import { uploadEntities } from '../TrialContext/Trials/uploadCsv';

export const UploadEntitiesDialog = ({ client, match, trial }) => {
    const [fileFormat, setFileFormat] = useState('CSV');
    const [open, setOpen] = useState(false);
    const ref = useRef();

    const uploadInfo = async (e) => {
        const text = await e.target.files[0].text();
        uploadEntities(text, trial, client, match)
        setOpen(false);
    }

    const downloadInfo = () => {
        downloadEntities({ client, match, trial });
        setOpen(false);
    }

    return (
        <>
            <Paper>
                <IconButton
                    onClick={() => setOpen(true)}
                >
                    <SaveIcon />
                </IconButton>
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
                        Upload & Download
                    </Typography>
                    <IconButton
                        size='small'
                        onClick={() => setOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box textAlign='center'>
                        <RadioGroup
                            row
                            value={fileFormat}
                            onChange={e => setFileFormat(e.value)}
                        >
                            <FormControlLabel value="CSV" control={<Radio />} label="CSV" />
                            <FormControlLabel value="GeoJson" control={<Radio />} label="GeoJson" disabled />
                        </RadioGroup>
                        <br />
                        <Button variant={'outlined'} color={'primary'}
                            onClick={() => ref.current.click()}
                        >
                            Upload
                            <input
                                type="file"
                                ref={ref}
                                onChange={(e) => uploadInfo(e)}
                                hidden
                            />
                        </Button>
                        <br />
                        <br />
                        <Button variant={'outlined'} color={'primary'}
                            onClick={downloadInfo}
                        >
                            Download
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}