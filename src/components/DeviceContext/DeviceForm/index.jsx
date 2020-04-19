import React from 'react';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import deviceMutation from './utils/deviceMutation';
import { updateCache } from '../../../apolloGraphql';
import {
  DEVICE_TYPES_DASH,
  DEVICE_TYPES,
  DEVICES, DEVICE_MUTATION, DEVICE_TYPE_MUTATION,
} from '../../../constants/base';
import deviceTypeMutation from '../utils/deviceTypeMutation';
import ContentHeader from '../../ContentHeader';
import CustomInput from '../../CustomInput';
import { styles } from './styles';
import Footer from '../../Footer';
import deviceTypesQuery from '../utils/deviceTypeQuery';
import devicesQuery from '../Devices/utils/deviceQuery';

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

    client.query({ query: deviceTypesQuery(match.params.id) }).then((data) => {
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
    const { match, history, returnFunc } = this.props;

    if (returnFunc) returnFunc();
    history.push(
      `/experiments/${match.params.id}/${DEVICE_TYPES_DASH}/${match.params.deviceTypeKey}/${DEVICES}`,
    );
  };

  submitDevice = async (newDevice) => {
    const { match, client, returnFunc } = this.props;
    const { deviceType } = this.state;

    await client.mutate({
      mutation: deviceMutation(newDevice),
      update: (cache, mutationResult) => {
        updateCache(
          cache,
          mutationResult,
          devicesQuery(match.params.id, match.params.deviceTypeKey),
          DEVICES,
          DEVICE_MUTATION,
          returnFunc,
        );
      },
    });

    // update number of devices of the device type
    if (!returnFunc) {
      const updatedDeviceType = { ...deviceType };
      updatedDeviceType.numberOfDevices += 1;
      updatedDeviceType.experimentId = match.params.id;

      await client.mutate({
        mutation: deviceTypeMutation(updatedDeviceType),
        update: (cache, mutationResult) => {
          updateCache(
            cache,
            mutationResult,
            deviceTypesQuery(match.params.id),
            DEVICE_TYPES,
            DEVICE_TYPE_MUTATION,
            true,
          );
        },
      });
    }

    this.closeForm();
  };

  getValue = (key) => {
    const properties = this.state.device.properties;
    const p = ((properties && properties.length) ? properties.findIndex(pr => pr.key === key) : -1);
    return (p !== -1 ? properties[p].val : '');
  }

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
              value={this.getValue(property.key)}
              values={property.value}
              type={property.type}
              multiple={property.multipleValues}
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
