import React from 'react';
import { withStyles } from '@material-ui/core';
import { styles } from './styles';

const StatusBadge = ({ classes, title, color }) => (
  <div className={classes.root} style={{ color, border: `1px solid ${color}` }}>
    {title}
  </div>
);

export default withStyles(styles)(StatusBadge);
