import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { styles } from './styles';
import SimpleButton from '../SimpleButton';

const Footer = ({
  saveButtonHandler,
  cancelButtonHandler,
  deleteButtonHandler,
  withDeleteButton,
  classes,
}) => (
  <Grid container justify="space-between" className={classes.root}>
    <div>
      <SimpleButton
        className={classes.saveButton}
        colorVariant="primary"
        onClick={saveButtonHandler}
        text="Save"
      />
      <SimpleButton
        variant="outlined"
        className={classes.cancelButton}
        onClick={cancelButtonHandler}
        text="Cancel"
      />
    </div>
    {withDeleteButton ? (
      <SimpleButton
        className={classes.deleteButton}
        variant="outlined"
        colorVariant="secondary"
        onClick={deleteButtonHandler}
        text="Delete"
      />
    ) : null}
  </Grid>
);

export default withStyles(styles)(Footer);
