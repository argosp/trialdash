import React, { createContext, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { styles } from './styles';
import Header from '../Header';
import LoadingOverlay from 'react-loading-overlay';

export const WorkingContext = createContext();

const AppLayout = ({ classes, children }) => {
  const [working, setWorking] = useState(false);
  return (
    <LoadingOverlay
      active={working}
      spinner
      text='Please wait...'
    >
      <WorkingContext.Provider value={{setWorking}}>
        <Header />
        <div className={classes.contentWrapper}>
          {children}
        </div>
      </WorkingContext.Provider>
    </LoadingOverlay>
  );
}


export default compose(withRouter, withStyles(styles))(AppLayout);
