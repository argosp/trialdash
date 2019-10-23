import React from 'react';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core';
import deviceMutation from './utils/deviceMutation';
import Graph from '../../../apolloGraphql';
import { DEVICES_CONTENT_TYPE } from '../../../constants/base';
import deviceTypeMutation from '../utils/deviceTypeMutation';
import ContentHeader from '../../ContentHeader';
import CustomInput from '../../CustomInput';
import { styles } from './styles';
import Footer from '../../Footer';

const graphql = new Graph();

class DeviceForm extends React.Component {
  constructor(props) {
    super(props);
    const properties = [];
    props.deviceType.properties.forEach(property => properties.push({ key: property.key, val: '' }));

    this.state = {
      device: {
        deviceTypeKey: props.deviceType.key,
        experimentId: props.experimentId,
        id: '',
        name: '',
        properties,
      },
    };
  }

  onPropertyChange = (e, propertyKey) => {
    const { value } = e.target;
    const indexOfProperty = this.state.device.properties.findIndex(
      property => property.key === propertyKey,
    );

    this.setState(state => ({
      device: {
        ...state.device,
        properties: update(state.device.properties, {
          [indexOfProperty]: { val: { $set: value } },
        }),
      },
    }));
  };

  onInputChange = (e, inputName) => {
    const { value } = e.target;

    this.setState(state => ({
      device: {
        ...state.device,
        [inputName]: value,
      },
    }));
  };

  cancelForm = () => {
    this.props.changeContentType(DEVICES_CONTENT_TYPE);
  };

  submitDevice = async (newDevice) => {
    const { deviceType, changeContentType, experimentId } = this.props;

    await graphql.sendMutation(deviceMutation(newDevice));

    // update number of devices of the device type
    const updatedDeviceType = { ...deviceType };
    let { numberOfDevices } = updatedDeviceType;
    numberOfDevices += 1;
    updatedDeviceType.numberOfDevices = numberOfDevices;
    updatedDeviceType.experimentId = experimentId;

    await graphql.sendMutation(deviceTypeMutation(updatedDeviceType));
    changeContentType(DEVICES_CONTENT_TYPE);
  };

  render() {
    const { deviceType, classes } = this.props;

    return (
      <>
        <ContentHeader
          title={`Add ${deviceType.name}`}
          className={classes.header}
        />
        <CustomInput
          id="device-name"
          className={classes.property}
          onChange={e => this.onInputChange(e, 'name')}
          label="Name"
          bottomDescription="a short description"
        />
        <CustomInput
          id="device-id"
          className={classes.property}
          onChange={e => this.onInputChange(e, 'id')}
          label="ID"
          bottomDescription="a short description"
        />
        {deviceType.properties
          ? deviceType.properties.map(property => (
            <CustomInput
              id={`device-property-${property.key}`}
              className={classes.property}
              key={property.key}
              onChange={e => this.onPropertyChange(e, property.key)}
              label={property.label}
              bottomDescription={property.description}
            />
          ))
          : null}
        <Footer
          cancelButtonHandler={this.cancelForm}
          saveButtonHandler={() => this.submitDevice(this.state.device)}
        />
      </>
    );
  }
}

export default withStyles(styles)(DeviceForm);
