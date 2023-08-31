import React, { createContext, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { LinearProgress, Snackbar } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { styles } from './styles';
import Header from '../Header';
// import LoadingOverlay from 'react-loading-overlay';

export const WorkingContext = createContext();

const AppLayout = ({ classes, children }) => {
  const [working, setWorking] = useState(false);
  const [snackMessage, setSnackMessage] = useState();
  const setInfoMessage = (msg) => setSnackMessage({ severity: 'info', msg });
  const setErrorMessage = (msg) => setSnackMessage({ severity: 'error', msg });
  return (
    <>
      {working
        ? <LinearProgress style={{ zIndex: 1000 }} />
        : null
      }
      <WorkingContext.Provider value={{ working, setWorking, setInfoMessage, setErrorMessage }}>
        <Header />
        <div className={classes.contentWrapper}>
          {children}
        </div>
        <Snackbar
          open={snackMessage}
          onClose={() => setSnackMessage()}
          message={snackMessage && snackMessage.msg}
          autoHideDuration={3000}
          severity={snackMessage && snackMessage.kind}
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
