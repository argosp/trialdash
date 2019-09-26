import React from 'react';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
import Graph from '../../../apolloGraphql';
// import deviceMutation from './utils/deviceMutation';
import { DEVICE_TYPES_CONTENT_TYPE } from '../../../constants/base';
import AddForm from '../../AddForm';
import FieldTypesPanel from '../../FieldTypesPanel';
import deviceTypeMutation from './utils/deviceTypeMutation';

const graphql = new Graph();

class DeviceTypeForm extends React.Component {
    state = {
      id: this.props.id || null,
      name: this.props.name || 'Device type name',
      type: this.props.type || '',
      properties: this.props.properties || [],
      numberOfDevices: this.props.numberOfDevices || 1,
      numberOfFields: this.props.numberOfFields || 1,
      entityType: 'deviceType',
      // options: ['text', 'number', 'date', 'location'],
    };

  cancelForm = () => {
    this.props.changeContentType(DEVICE_TYPES_CONTENT_TYPE);
  };

  /*
  handleChange = key => (event) => {
    this.setState({
      [key]: event.target.value,
    });
  };

  addProperty = () => {
    this.state.properties.push({ key: '', val: '' });
    this.setState({});
  };

  handleChangeProprty = (index, key) => (event) => {
    this.state.properties[index][key] = event.target.value;
    this.setState({});
  }; */

  submitDeviceType = () => {
    const newDeviceType = {
      id: this.state.id,
      experimentId: this.props.experimentId,
      name: this.state.name,
      notes: this.state.notes,
      type: this.state.type,
      numberOfDevices: this.state.numberOfDevices,
      numberOfFields: this.state.numberOfFields,
      entityType: this.state.entityType,
      properties: this.state.properties.map(p => ({
        key: p.key,
        val: p.val,
        type: p.type,
      })),
    };

    graphql
      .sendMutation(deviceTypeMutation(newDeviceType))
      .then((data) => {
        window.alert(
          `saved ${data.addUpdateDeviceTypes.id}`,
        );
        // this.props.showAll();
      })
      .catch((err) => {
        window.alert(`error: ${err}`);
      });
  };

  render() {
    return (
      <>
        <AddForm
          withFooter
          rightPanel={<FieldTypesPanel />}
          cancelFormHandler={this.cancelForm}
          saveFormHandler={this.submitDeviceType}
          headerTitle="Add device type"
          headerDescription="a short description of what it means to add a device here"
          commonInputs={[
            {
              key: 0,
              id: 'device-type-name',
              label: 'Name',
              description: 'a short description about the device name',
            },
            {
              key: 1,
              id: 'device-type-id',
              label: 'ID',
              description: 'a short description about the device name',
            },
          ]}
        />
        {/*        <TextField
          style={{ width: '300px', marginTop: '30px' }}
          id="name"
          label="Name Format"
          className={classes.textField}
          value={this.state.name}
          onChange={this.handleChange('name')}
        />
        <br />
        <TextField
          style={{ width: '300px', marginTop: '30px' }}
          id="type"
          label="Type"
          className={classes.textField}
          value={this.state.type}
          onChange={this.handleChange('type')}
        />
        <br />
        <TextField
          style={{ width: '300px', marginTop: '30px' }}
          id="number"
          type="number"
          label={`Number of ${this.props.entityType}s`}
          className={classes.textField}
          value={this.state.number}
          onChange={this.handleChange('number')}
          inputProps={{ min: '1' }}
        />
        <br />
        <TextField
          style={{ width: '300px', marginTop: '30px' }}
          id="notes"
          label="Notes"
          multiline
          rows={5}
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
              value={p.type}
              onChange={this.handleChangeProprty(i, 'type')}
              MenuProps={MenuProps}
            >
              {this.state.options
                && this.state.options.map(o => (
                  <MenuItem key={o} value={o}>
                    {o}
                  </MenuItem>
                ))}
            </Select>
            <TextField
              style={{ width: '300px' }}
              type={p.type}
              label="value"
              className={classes.textField}
              value={p.val}
              onChange={this.handleChangeProprty(i, 'val')}
            />
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
          <div style={{ marginTop: '50px', textAlign: 'center' }}>
            <Button
              variant="contained"
              className={classes.button}
              style={{ width: '180px' }}
              onClick={this.submitDevice}
            >
              Submit
            </Button>
          </div>
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
        </div> */}
      </>
    );
  }
}

export default DeviceTypeForm;
