import { forwardRef } from 'react';
import {
    Snackbar,
    IconButton,
    Button,
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const SnackBarMessage = ({ snackMessage, setSnackMessage }) => {
    let severity = 'info';
    let message = '';
    let isRefresh = snackMessage && snackMessage.severity === 'refresh';
    if (isRefresh) {
        message = snackMessage.msg || 'Please refresh to apply changes';
        severity = 'info';
    } else if (snackMessage) {
        message = snackMessage.msg || '';
        severity = snackMessage.severity || 'info';
    }
    return (
        <Snackbar
            autoHideDuration={4000}
            open={snackMessage}
            onClose={() => setSnackMessage()}
            action={
                <Alert
                    variant="filled"
                    severity={severity}
                    sx={{ width: '100%' }}
                    size='small'
                >
                    {message}
                    {!isRefresh ? null :
                        <Button color="secondary" size="small"
                            onClick={() => {
                                window.location.reload();
                            }}
                        >
                            Refresh now
                        </Button>
                    }
                    <IconButton size="small" aria-label="close" color="inherit"
                        onClick={() => setSnackMessage()}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Alert>
            }
        />
    )
}

