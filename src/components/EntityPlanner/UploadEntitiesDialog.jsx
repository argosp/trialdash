import React, { useState } from 'react';
import {
    Box, Button, RadioGroup,
    Radio,
    FormControlLabel
} from '@material-ui/core';
import { ButtonWithDialog } from './ButtonWithDialog';
import { downloadEntities } from '../TrialContext/Trials/downloadCsv';
import { uploadEntities } from '../TrialContext/Trials/uploadCsv';

export const UploadEntitiesDialog = ({ client, match, trial }) => {
    const [value, setValue] = useState('CSV');

    const uploadInfo = () => {
        uploadEntities(e, trial, client, match)
    }

    const downloadInfo = () => {
        downloadEntities({ client, match, trial });
    }

    return (
        <ButtonWithDialog
            title={'Upload & Download'}
            titleButton={'Upload'}
        >
            <Box textAlign='center'>
                <RadioGroup
                    row
                    value={value}
                    onChange={e => setValue(e.value)}
                >
                    <FormControlLabel value="CSV" control={<Radio />} label="CSV" />
                    <FormControlLabel value="GeoJson" control={<Radio />} label="GeoJson" disabled />
                </RadioGroup>
                <br />
                <Button variant={'outlined'} color={'primary'}
                    onClick={uploadInfo}
                >
                    Upload
                </Button>
                <br />
                <br />
                <Button variant={'outlined'} color={'primary'}
                    onClick={downloadInfo}
                >
                    Download
                </Button>
            </Box>
        </ButtonWithDialog>
    )
}