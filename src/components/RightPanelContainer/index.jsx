import React from 'react';
import { withStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import { styles } from './styles';

const RightPanelContainer = ({ classes, title, children, isPanelOpen, onClose, className }) => (
  <div className={isPanelOpen ? `${classes.root} ${className}` : classes.hiddenRoot}>
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      className={classes.headerWrapper}
    >
      {title}
      <CloseIcon
        fontSize="large"
        className={classes.closeIcon}
        onClick={onClose}
      />
    </Grid>
    {children}
  </div>
);


export default withStyles(styles)(RightPanelContainer);
