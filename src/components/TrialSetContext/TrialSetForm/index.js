import React from 'react';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
// import Graph from '../../../apolloGraphql';
// import trialSetMutation from './utils/trialSetMutation';
import { styles } from './styles';
import ContentHeader from '../../ContentHeader';
import CustomInput from '../../CustomInput';
import CustomHeadline from '../../CustomHeadline';
import AttributeItem from '../../AttributeItem';

// const graphql = new Graph();

class TrialSetForm extends React.Component {
  /*  constructor(props) {
    super(props);
    this.state = {
      id: props.id || null,
      name: props.name || '',
      notes: props.notes || '',
      type: '',
      properties: props.properties || [],
      devicesList: props.devicesList || [],
      devices: props.devices || [],
      options: ['text', 'number', 'date', 'location'],
    };
  } */

  /*  handleChange = key => (event) => {
    this.setState({
      [key]: event.target.value,
    });
  }; */

  /*  handleChangeProprty = (index, key) => (event) => {
    this.state.properties[index][key] = event.target.value;
    this.setState({});
  }; */

  /*  submitTrialSet = () => {
    const newTrialSet = {
      id: this.state.id,
      experimentId: this.props.experimentId,
      name: this.state.name,
      notes: this.state.notes,
      type: this.state.type,
      properties: this.state.properties.map(p => ({ key: p.key, val: p.val })),
    };

    graphql
      .sendMutation(trialSetMutation(newTrialSet))
      .then((data) => {
        window.alert(`saved trialSet ${data.addUpdateTrialSet.name}`);
        this.props.showAll();
      })
      .catch((err) => {
        window.alert(`error: ${err}`);
      });
  }; */

  /*  addProperty = () => {
    this.state.properties.push({ key: '', val: '' });
    this.setState({});
  }; */

  render = () => {
    const { classes, theme } = this.props;

    return (
      <>
        <ContentHeader
          title="Add Device type"
          bottomDescription="a short description of what it means to add a device here"
        />
        <form className={classes.form}>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <CustomInput
                className={classes.mainInput}
                id="trial-set-name"
                label="Name"
                bottomDescription="a short description about the device name"
              />
            </Grid>
            <Grid item xs={3}>
              <CustomInput
                className={classes.mainInput}
                id="trial-set-id"
                label="ID"
                bottomDescription="a short description about the device name"
              />
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <CustomInput
                className={classes.mainInput}
                id="trial-set-description"
                label="Description"
                bottomDescription="a short description about the device name"
              />
            </Grid>
          </Grid>
          <CustomHeadline
            className={classes.attributesHeadline}
            title="Attributes"
            description="Drag fields from the right bar"
            titleFontSize={18}
            descriptionFontSize={16}
            titleColor={theme.palette.black.main}
            descriptionColor={theme.palette.gray.dark}
          />
          <AttributeItem
            type="text"
            title="Release type"
            inputId="trial-set-attribute-description"
            placeholder="enter sku here"
            bottomDescription="a short description of the field"
          />
        </form>
        {/* <form
        className={classes.container}
        noValidate
        autoComplete="off"
        style={{ textAlign: 'left' }}
        >
        <TextField
          style={{ width: '300px', marginTop: '30px' }}
          id="name"
          label="Name"
          type="text"
          className={classes.textField}
          value={this.state.name}
          onChange={this.handleChange('name')}
        />
        <br />
        <TextField
          style={{ width: '300px', marginTop: '30px' }}
          id="notes"
          label="Notes"
          type="text"
          className={classes.textField}
          value={this.state.notes}
          onChange={this.handleChange('notes')}
        />
        <br />
        <h3>properties:</h3>
        {this.state.properties.map((p, i) => (
          <div key={i} style={{ display: 'flex' }}>
            <TextField
              style={{ width: '300px' }}
              label="name"
              className={classes.textField}
              value={p.key}
              onChange={this.handleChangeProprty(i, 'key')}
            />
            <br />
            <InputLabel htmlFor="select-multiple-chip">Type</InputLabel>
            <Select
              value={p.val}
              onChange={this.handleChangeProprty(i, 'val')}
                // input={<Input id="select-multiple-chip" />}
                // renderValue={selected => (<Chip label={selected.id} className={classes.chip} />)}
            >
              {this.state.options && this.state.options.map(o => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </Select>
            <br />
          </div>
        ))}

        <Button
          variant="contained"
          className={classes.button}
          style={{ width: '180px' }}
          onClick={this.addProperty}
        >
                    + Add Property
        </Button>
        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <Button
            variant="contained"
            className={classes.button}
            style={{ width: '180px' }}
            onClick={this.submitTrialSet}
          >
                        Submit
          </Button>
          {this.props.cancel && (
          <Button
            variant="contained"
            className={classes.button}
            style={{ width: '180px' }}
            onClick={this.props.showAll}
          >
                        Cancel
          </Button>
          )}
        </div>
      </form> */}
      </>
    );
  };
}

export default withStyles(styles, { withTheme: true })(TrialSetForm);
