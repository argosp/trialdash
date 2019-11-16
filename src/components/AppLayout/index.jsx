import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { styles } from './styles';
import Header from '../Header';

const AppLayout = ({ classes, children }) => (
  <>
    <Header />
    <div className={classes.contentWrapper}>
      {children}
    </div>
  </>
);


export default compose(withRouter, withStyles(styles))(AppLayout);
