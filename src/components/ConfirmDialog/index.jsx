import React from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core";
import { compose } from "recompose";
import SimpleButton from "../SimpleButton";
import { styles } from "./styles";

class ConfirmDialog extends React.Component {
  state = {
    text: "",
  };

  handleChange = (field) => (event) => {
    this.setState({ [field]: event.target.value });
  };

  render() {
    const {
      title,
      children,
      open,
      setOpen,
      onConfirm,
      confirmText,
      confirmColor,
      classes,
      inputValidation,
      cancelColor,
      onCancel,
      cancelText,
    } = this.props;
    const { text } = this.state;
    return (
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="customized-dialog-title"
      >
        <DialogTitle
          id="customized-dialog-title"
          className={classes.root}
          disableTypography
        >
          <Typography variant="h6">{title}</Typography>
          <IconButton aria-label="close" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>{children}</DialogContentText>
          {inputValidation && (
            <DialogContentText>
              Please type <strong>ARGOS</strong> to confirm.
            </DialogContentText>
          )}
          {inputValidation && (
            <TextField
              autoFocus
              margin="dense"
              id="text"
              type="text"
              fullWidth
              onChange={this.handleChange("text")}
            />
          )}
        </DialogContent>
        <DialogActions>
          {onCancel && (
            <SimpleButton
              variant="outlined"
              style={{ color: cancelColor }}
              onClick={() => {
                setOpen && setOpen(false);
                onCancel();
              }}
              text={cancelText || "Cancel"}
              disabled={inputValidation && text !== "ARGOS"}
            />
          )}
          <SimpleButton
            variant="outlined"
            colorVariant="secondary"
            style={{ color: confirmColor || "#EB5757" }}
            onClick={() => {
              setOpen && setOpen(false);
              onConfirm();
            }}
            text={confirmText || "Delete"}
            disabled={inputValidation && text !== "ARGOS"}
          />
        </DialogActions>
      </Dialog>
    );
  }
}
export default compose(withStyles(styles))(ConfirmDialog);
