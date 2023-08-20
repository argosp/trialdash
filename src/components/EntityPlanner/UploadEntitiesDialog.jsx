import React, { Fragment, useState } from 'react';
import {
    Grid,
    IconButton,
    Box,
    Paper,
    Button,
    Tooltip,
    Dialog,
    DialogTitle,
    Typography,
    RadioGroup,
    Radio,
    FormControlLabel
} from '@material-ui/core';
import CloseIcon from "@material-ui/icons/Close";
import { ButtonWithDialog } from './ButtonWithDialog';

export const UploadEntitiesDialog = ({ }) => {
    const [value, setValue] = useState('CSV');
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
                // onClick={() => setOpen(true)}
                >
                    Upload
                </Button>
                <br />
                <br />
                <Button variant={'outlined'} color={'primary'}
                // onClick={() => setOpen(true)}
                >
                    Download
                </Button>
            </Box>
        </ButtonWithDialog>
    )
}