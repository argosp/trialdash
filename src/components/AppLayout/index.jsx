import React, { createContext, useState } from 'react';
import { withStyles } from '@mui/styles';
import { LinearProgress, Snackbar, IconButton, Button } from '@mui/material';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { styles } from './styles';
import Header from '../Header';
import CloseIcon from "@mui/icons-material/Close";
// import LoadingOverlay from 'react-loading-overlay';

export const WorkingContext = createContext();

const SnackBarMessage = ({ snackMessage, setSnackMessage }) => {
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

const AppLayout = ({ classes, children }) => {
  const [working, setWorking] = useState(false);
  const [snackMessage, setSnackMessage] = useState();
  const setInfoMessage = (msg) => setSnackMessage({ severity: 'info', msg });
  const setErrorMessage = (msg) => setSnackMessage({ severity: 'error', msg });
  const setRefreshMessage = (msg = undefined) => setSnackMessage({ severity: 'refresh', msg: msg ? msg : 'Please refresh to apply changes' });
  return (
    <>
      {working
        ? <LinearProgress style={{ zIndex: 1000 }} />
        : null
      }
      <WorkingContext.Provider value={{ working, setWorking, setInfoMessage, setErrorMessage, setRefreshMessage }}>
        <Header />
        <div className={classes.contentWrapper}>
          {children}
        </div>
        <SnackBarMessage
          snackMessage={snackMessage}
          setSnackMessage={setSnackMessage}
        />
      </WorkingContext.Provider>
    </>

    // <LoadingOverlay
    //   active={working}
    //   spinner
    //   text='Please wait...'
    //   styles={{
    //     overlay: (base) => ({
    //       ...base,
    //       top: '35vh',
    //       height: '30vh',
    //       left: '35vw',
    //       width: '30vw',
    //       position: 'absolute',
    //       borderRadius: 20
    //     })
    //   }}
    // >
    // {/* <div
    //   style={{ bottom: 0, top: 0, height: '100vh' }}
    // > */}
    // {/* </div> */}
    // </LoadingOverlay>
  );
}


export default compose(withRouter, withStyles(styles))(AppLayout);
