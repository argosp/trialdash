import React, { useContext } from 'react';
import { withStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import { styles } from './styles';
import SimpleButton from '../SimpleButton';
import { WorkingContext } from '../AppLayout';

const Footer = ({
  saveButtonHandler,
  cancelButtonHandler,
  deleteButtonHandler,
  withDeleteButton,
  classes,
  cancelButtonDisabled,
  saveButtonDisabled
}) => {
  const { working } = useContext(WorkingContext);
  return (
    <Grid container justifyContent="space-between" className={classes.root}>
      <div>
        <SimpleButton
          className={classes.saveButton}
          colorVariant="primary"
          onClick={saveButtonHandler}
          text="Save"
          disabled={working || saveButtonDisabled}
        />
        <SimpleButton
          variant="outlined"
          className={classes.cancelButton}
          onClick={cancelButtonHandler}
          text="Cancel"
          disabled={working || cancelButtonDisabled}
        />
      </div>
      {withDeleteButton ? (
        <SimpleButton
          variant="outlined"
          colorVariant="secondary"
          onClick={deleteButtonHandler}
          text="Delete"
        />
      ) : null}
    </Grid>
  );
}

export default withStyles(styles)(Footer);
