import React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { withStyles } from '@mui/styles';
import { compose } from 'recompose';
import SimpleButton from '../SimpleButton';
import { styles } from './styles';

class ConfirmDialog extends React.Component {
    state = {
      text: '',
    };

    handleChange = field => (event) => {
      this.setState({ [field]: event.target.value });
    }

    render() {
      const { title, children, open, setOpen, onConfirm, confirmText, confirmColor, classes, inputValidation, cancelColor, onCancel, cancelText } = this.props;
      const { text } = this.state;
      return (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="customized-dialog-title"
        >
          <DialogTitle id="customized-dialog-title" className={classes.root} disableTypography>
            <Typography variant="h6">{title}</Typography>
            <IconButton aria-label="close" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              {children}
            </DialogContentText>
            {inputValidation && <DialogContentText>
              Please type <strong>ARGOS</strong> to confirm.
            </DialogContentText>}
            {inputValidation && <TextField
              autoFocus
              margin="dense"
              id="text"
              type="text"
              fullWidth
              onChange={this.handleChange('text')}
            />}
          </DialogContent>
          <DialogActions>
            {onCancel && <SimpleButton
              variant="outlined"
              style={{ color: cancelColor }}
              onClick={() => {
                setOpen && setOpen(false);
                onCancel();
              }}
              text={cancelText || "Cancel"}
              disabled={inputValidation && (text !== 'ARGOS')}
            />}
            <SimpleButton
              variant="outlined"
              colorVariant="secondary"
              style={{ color: confirmColor || '#EB5757' }}
              onClick={() => {
                setOpen && setOpen(false);
                onConfirm();
              }}
              text={confirmText || "Delete"}
              disabled={inputValidation && (text !== 'ARGOS')}
            />
          </DialogActions>
        </Dialog>
      );
    }
}
export default compose(
  withStyles(styles),
)(ConfirmDialog);
