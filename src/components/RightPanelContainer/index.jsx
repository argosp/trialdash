import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import { styles } from "./styles";

const RightPanelContainer = ({
  classes,
  title,
  children,
  isPanelOpen,
  onClose,
  className,
}) => (
  <div
    className={
      isPanelOpen ? `${classes.root} ${className}` : classes.hiddenRoot
    }
  >
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
