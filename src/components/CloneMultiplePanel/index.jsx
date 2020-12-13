import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import { styles } from './styles';
import RightPanelContainer from '../RightPanelContainer';
import { CloneMultipleIcon } from '../../constants/icons';
import SimpleButton from '../SimpleButton';
import CustomInput from '../CustomInput';

class CloneMultiplePanel extends React.Component {
  state = {
    number: null,
    name: null,
    id: null,
  }

  onInputChange = (e, inputName) => {
    this.setState({ [inputName]: e.target.value });
  }

  cancel = () => {
    const { onClose } = this.props;
    this.setState({ number: '', id: '', name: '' });
    onClose();
  }

  validateAndCreate = () => {
    const { cloneMultiple } = this.props;
    const { number, name, id } = this.state;
    let invalid = false;
    if (!number || number === '') {
      this.state.invalidNumber = true;
      invalid = true;
    } else {
      this.state.invalidNumber = false;
    }
    this.state.nameError = null;
    if (!name || name === '') {
      this.state.invalidName = true;
      invalid = true;
    } else if (!name.match(/.*\{\d+\}.*/)) {
      this.state.invalidName = true;
      this.state.nameError = 'Invalid number format';
      invalid = true;
    } else {
      this.state.invalidName = false;
    }
    this.state.idError = null;
    if (!id || id === '') {
      this.state.invalidId = true;
      invalid = true;
    } else if (!id.match(/.*\{\d+\}.*/)) {
      this.state.invalidId = true;
      this.state.idError = 'Invalid number format';
      invalid = true;
    } else {
      this.state.invalidId = false;
    }
    if (invalid) {
      this.setState({ });
      return;
    }
    this.setState({ number: '', id: '', name: '' });
    cloneMultiple(number, name, id);
  }

  render() {
    const { classes, isPanelOpen, onClose } = this.props;
    const { number, name, id } = this.state;

    return (
      <RightPanelContainer
        isPanelOpen={isPanelOpen}
        onClose={onClose}
        title={
          (
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.headerTitle}
            >
              <CloneMultipleIcon style={{ width: 22, height: 26 }} />
              <Typography className={classes.label}>
                Create Multiple
              </Typography>
            </Grid>
          )
        }
      >
        <div className={classes.content}>
          <Grid>
            <CustomInput
              id="number"
              onChange={e => this.onInputChange(e, 'number')}
              value={number}
              label="Number of devices to create"
              type="number"
              className={classes.input}
              invalid={this.state.invalidNumber}
            />
          </Grid>
          <Grid>
            <CustomInput
              id="name-pettern"
              onChange={e => this.onInputChange(e, 'name')}
              value={name}
              label="Name pattern"
              type="text"
              className={classes.input}
              placeholder="Example: deviceName{001}december test"
              bottomDescription="[prefix]{number format}[suffix]
              prefix - text field (optional), number format - number field (required), suffix- text field (optional)"
              invalid={this.state.invalidName}
              errorText={this.state.nameError}
            />
          </Grid>
          <Grid>
            <CustomInput
              id="id-pettern"
              onChange={e => this.onInputChange(e, 'id')}
              value={id}
              label="ID pattern"
              type="text"
              className={classes.input}
              placeholder="Example: deviceName{001}december test"
              bottomDescription="[prefix]{number format}[suffix]
              prefix - text field (optional), number format - number field (required), suffix- text field (optional)"
              invalid={this.state.invalidId}
              errorText={this.state.idError}
            />
          </Grid>
          <Grid
            container
            wrap="nowrap"
            spacing={2}
            className={classes.buttonsWrapper}
          >
            <Grid item xs>
              <SimpleButton
                className={classes.button}
                colorVariant="primary"
                onClick={() => this.validateAndCreate()}
                text="Create"
              />
            </Grid>
            <Grid item xs>
              <SimpleButton
                variant="outlined"
                className={classnames(classes.button, classes.cancelButton)}
                onClick={this.cancel}
                text="Cancel"
              />
            </Grid>
          </Grid>
        </div>
      </RightPanelContainer>
    );
  }
}

export default withStyles(styles)(CloneMultiplePanel);
