import React from 'react';
import { withStyles } from '@mui/styles';
import classnames from 'classnames';
import { styles } from './styles';

const StatusBadge = ({ classes, className, title, color, onClick, onMouseEnter, onMouseLeave }) => (
  <div
    className={classnames(classes.root, className)}
    style={{ color, border: `2px solid ${color}` }}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {title}
  </div>
);

export default withStyles(styles)(StatusBadge);
