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
      styles={{
        overlay: (base) => ({
          ...base,
          top: '35vh',
          height: '30vh',
          left: '35vw',
          width: '30vw',
          position: 'absolute',
          borderRadius: 20
        })
      }}
    >
      {/* <div
        style={{ bottom: 0, top: 0, height: '100vh' }}
      > */}
      <WorkingContext.Provider value={{ working, setWorking }}>
        <Header />
        <div className={classes.contentWrapper}>
          {children}
        </div>
      </WorkingContext.Provider>
      {/* </div> */}
    </LoadingOverlay>
  );
}


export default compose(withRouter, withStyles(styles))(AppLayout);
