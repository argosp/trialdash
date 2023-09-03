import {
    Snackbar,
    IconButton,
    Button
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

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
            autoHideDuration={3000}
            open={snackMessage}
            onClose={() => setSnackMessage()}
            message={message}
            severity={severity}
            action={
                <>
                    {!isRefresh ? null :
                        <Button color="primary" size="small"
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
                </>
            }
        />
    )
}

