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
    prefix: '',
    numberFormat: '',
    suffix: ''
  }

  onInputChange = (e, inputName) => {
    this.setState({ [inputName]: e.target.value });
  }

  cancel = () => {
    const { onClose } = this.props;
    this.setState({ number: '', prefix: '', numberFormat: '', suffix: '' });
    onClose();
  }

  validateAndCreate = () => {
    const { cloneMultiple } = this.props;
    const { number, prefix, numberFormat, suffix } = this.state;
    let invalid = false;
    if (!number || number === '') {
      this.state.invalidNumber = true;
      invalid = true;
    } else {
      this.state.invalidNumber = false;
    }
    this.state.numberFormatError = null;
    if (!numberFormat || numberFormat === '') {
      this.state.invalidNumberFormat = true;
      invalid = true;
    } else if (!numberFormat.match(/^\d+$/)) {
      this.state.invalidNumberFormat = true;
      this.state.numberFormatError = 'Invalid number format';
      invalid = true;
    } else {
      this.state.invalidNumberFormat = false;
    }
    if (invalid) {
      this.setState({ });
      return;
    }
    this.setState({ number: '', prefix: '', numberFormat: '', suffix: '' });
    cloneMultiple(number, `${prefix}{${numberFormat}}${suffix}`);
  }

  render() {
    const { classes, isPanelOpen, onClose } = this.props;
    const { number, prefix, numberFormat, suffix } = this.state;

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
              id="prefix"
              onChange={e => this.onInputChange(e, 'prefix')}
              value={prefix}
              label="Name Prefix"
              type="text"
              className={classes.input}
              placeholder="Example: deviceName"
            />
          </Grid>
          <Grid>
            <CustomInput
              id="numberFormat"
              onChange={e => this.onInputChange(e, 'numberFormat')}
              value={numberFormat}
              label="Name Number format"
              type="text"
              className={classes.input}
              placeholder="Example: 000"
              invalid={this.state.invalidNumberFormat}
              errorText={this.state.numberFormatError}
            />
          </Grid>
          <Grid>
            <CustomInput
              id="suffix"
              onChange={e => this.onInputChange(e, 'suffix')}
              value={suffix}
              label="Name Suffix"
              type="text"
              className={classes.input}
              placeholder="Example: december test"
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
