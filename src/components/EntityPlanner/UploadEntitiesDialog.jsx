import React, { useContext, useState } from 'react';
import {
    Box,
    Button, IconButton, Dialog,
    DialogTitle,
    DialogContent, Tooltip
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from "@mui/icons-material/Close";
import { downloadEntities } from '../TrialContext/Trials/downloadCsv';
import { uploadEntities } from '../TrialContext/Trials/uploadCsv';
import { WorkingContext } from '../AppLayout/AppLayout.jsx';
import { ButtonWithFileInput } from '../ButtonWithFileInput';

export const UploadEntitiesDialog = ({ client, match, trial, entities }) => {
    const { setWorking, setRefreshMessage } = useContext(WorkingContext);
    // const [fileFormat, setFileFormat] = useState('CSV');
    const [open, setOpen] = useState(false);

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
                        <ButtonWithFileInput variant={'outlined'} color={'primary'}
                            onChange={(e) => uploadInfo(e)}
                        >
                            Upload CSV
                        </ButtonWithFileInput>
                        &nbsp;
                        <ButtonWithFileInput variant={'outlined'} color={'primary'}
                            onChange={(e) => uploadInfo(e)}
                        >
                            Upload GeoJson
                        </ButtonWithFileInput>
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