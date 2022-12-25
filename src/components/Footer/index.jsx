import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { styles } from "./styles";
import SimpleButton from "../SimpleButton";

const Footer = ({
  saveButtonHandler,
  cancelButtonHandler,
  deleteButtonHandler,
  withDeleteButton,
  classes,
  loading,
  cancelButtonDisabled,
  saveButtonDisabled,
}) => (
  <Grid container justifyContent="space-between" className={classes.root}>
    <div>
      <SimpleButton
        className={classes.saveButton}
        colorVariant="primary"
        onClick={saveButtonHandler}
        text="Save"
        disabled={loading || saveButtonDisabled}
      />
      <SimpleButton
        variant="outlined"
        className={classes.cancelButton}
        onClick={cancelButtonHandler}
        text="Cancel"
        disabled={loading || cancelButtonDisabled}
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

export default withStyles(styles)(Footer);
