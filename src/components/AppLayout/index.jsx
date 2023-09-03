import React, { createContext, useState } from 'react';
import { withStyles } from '@mui/styles';
import { LinearProgress } from '@mui/material';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { styles } from './styles';
import Header from '../Header';
import { SnackBarMessage } from './SnackBarMessage';

export const WorkingContext = createContext();

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
  );
}

export default compose(withRouter, withStyles(styles))(AppLayout);
