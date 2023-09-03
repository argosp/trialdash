import React from 'react';
import { Typography, Box } from '@mui/material';

export const TabPanel = ({ children, value, index, ...other }) => (
    <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`trial-tabpanel-${index}`}
        aria-labelledby={`trial-tab-${index}`}
        style={{ marginBottom: '100px' }}
        {...other}
    >
        <Box>{children}</Box>
    </Typography>
);

