import React, { useContext, useRef, useState } from 'react';
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
    Tooltip,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from "@material-ui/icons/Close";
import { downloadEntities } from '../TrialContext/Trials/downloadCsv';
import { uploadEntities } from '../TrialContext/Trials/uploadCsv';
import { WorkingContext } from '../AppLayout';

export const UploadEntitiesDialog = ({ client, match, trial, entities }) => {
    const { setWorking } = useContext(WorkingContext);
    const [fileFormat, setFileFormat] = useState('CSV');
    const [open, setOpen] = useState(false);
    const ref = useRef();

    const uploadInfo = async (e) => {
        setWorking(true);
        try {
            const text = await e.target.files[0].text();
            await uploadEntities(text, trial, client, match, entities)
        } catch (e) {
            console.log(e)
        }
        setOpen(false);
        setWorking(false);
    }

    const downloadInfo = async () => {
        setWorking(true);
        try {
            await downloadEntities({ client, match, trial });
        } catch (e) {
            console.log(e)
        }
        setOpen(false);
        setWorking(false);
    }

    return (
        <>
            <Tooltip title='Upload & Download Entities' placement="top">
                <IconButton
                    onClick={() => setOpen(true)}
                >
                    <SaveIcon />
                </IconButton>
            </Tooltip>
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
                        Upload & Download Entities
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
                            onClick={() => downloadInfo()}
                        >
                            Download
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}