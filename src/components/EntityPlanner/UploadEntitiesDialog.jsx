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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from "@mui/icons-material/Close";
import { downloadEntities } from '../TrialContext/Trials/downloadCsv';
import { uploadEntities } from '../TrialContext/Trials/uploadCsv';
import { WorkingContext } from '../AppLayout/AppLayout.jsx';

export const UploadEntitiesDialog = ({ client, match, trial, entities }) => {
    const { setWorking, setRefreshMessage } = useContext(WorkingContext);
    // const [fileFormat, setFileFormat] = useState('CSV');
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
        setRefreshMessage();
    }

    const downloadInfo = async (fileFormat) => {
        setWorking(true);
        try {
            await downloadEntities({ client, match, trial, fileFormat });
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
                >
                    <span>
                        Upload & Download Entities
                    </span>
                    <IconButton
                        size='small'
                        onClick={() => setOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box textAlign='center'>
                        <Button variant={'outlined'} color={'primary'}
                            onClick={() => ref.current.click()}
                        >
                            Upload CSV
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
                            onClick={() => downloadInfo('csv')}
                        >
                            Download CSV
                        </Button>
                        &nbsp;
                        <Button variant={'outlined'} color={'primary'}
                            onClick={() => downloadInfo('geojson')}

                        >
                            Download GeoJson
                        </Button>
                        {/* <br /> */}
                        {/* <RadioGroup
                            // row
                            value={fileFormat}
                            onChange={e => setFileFormat(e.target.value)}
                        >
                            <FormControlLabel value="CSV" control={<Radio />} label="CSV" />
                            <FormControlLabel value="GeoJson" control={<Radio />} label="GeoJson" />
                        </RadioGroup>
                        <br /> */}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}