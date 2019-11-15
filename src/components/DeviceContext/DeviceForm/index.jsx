import React from 'react';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import deviceMutation from './utils/deviceMutation';
import Graph from '../../../apolloGraphql';
import {
  DEVICE_TYPES,
  DEVICES_CONTENT_TYPE,
} from '../../../constants/base';
import deviceTypeMutation from '../utils/deviceTypeMutation';
import ContentHeader from '../../ContentHeader';
import CustomInput from '../../CustomInput';
import { styles } from './styles';
import Footer from '../../Footer';
import deviceTypesQuery from '../utils/deviceTypeQuery';
import devicesQuery from '../Devices/utils/deviceQuery';

const graphql = new Graph();

class DeviceForm extends React.Component {
    state = {
      device: {
        deviceTypeKey: this.props.match.params.deviceTypeKey,
        experimentId: this.props.match.params.id,
        id: '',
        name: '',
        properties: [],
      },
      deviceType: {},
    };

    componentDidMount() {
      const { client, match } = this.props;

      client.query({ query: deviceTypesQuery(match.params.id) })
        .then((data) => {
          const deviceType = data.data.deviceTypes.find(
            item => item.key === match.params.deviceTypeKey,
          );
          const properties = [];

          deviceType.properties.forEach(property => properties.push({ key: property.key, val: '' }));

          this.setState(state => ({
            device: {
              ...state.device,
              properties,
            },
            deviceType,
          }));
        });
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

  closeForm = () => {
    const { match, history } = this.props;

    history.push(
      `/experiments/${match.params.id}/${DEVICE_TYPES}/${match.params.deviceTypeKey}/${DEVICES_CONTENT_TYPE}`,
    );
  };

  submitDevice = async (newDevice) => {
    const { match, client } = this.props;
    const { deviceType } = this.state;

    await client.mutate({
      mutation: deviceMutation(newDevice),
      update: (cache, mutationResult) => {
        const { devices } = cache.readQuery({
          query: devicesQuery(match.params.id, match.params.deviceTypeKey),
        });

        cache.writeQuery({ // set the new device in Apollo cache
          query: devicesQuery(match.params.id, match.params.deviceTypeKey),
          data: { devices: devices.concat([mutationResult.data.addUpdateDevice]) },
        });
      },
    });

    // update number of devices of the device type
    const updatedDeviceType = { ...deviceType };
    let { numberOfDevices } = updatedDeviceType;
    numberOfDevices += 1;
    updatedDeviceType.numberOfDevices = numberOfDevices;
    updatedDeviceType.experimentId = match.params.id;

    await graphql.sendMutation(deviceTypeMutation(updatedDeviceType));
    this.closeForm();
  };

  render() {
    const { classes } = this.props;
    const { deviceType } = this.state;

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
          cancelButtonHandler={this.closeForm}
          saveButtonHandler={() => this.submitDevice(this.state.device)}
        />
      </>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles),
)(DeviceForm);
