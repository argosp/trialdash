/* eslint-disable prefer-destructuring */
import React from 'react';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core';
import uuid from 'uuid/v4';
import Typography from '@material-ui/core/Typography';
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
      key: this.props.device ? this.props.device.key : uuid(),
      deviceTypeKey: this.props.match.params.deviceTypeKey,
      experimentId: this.props.match.params.id,
      id: this.props.device ? this.props.device.id : '',
      name: this.props.device ? this.props.device.name : '',
      properties: this.props.device && this.props.device.properties ? this.props.device.properties : [],
    },
    deviceType: {},
  };

  componentDidMount() {
    const { client, match, device } = this.props;

    client.query({ query: deviceTypesQuery(match.params.id) }).then((data) => {
      const deviceType = data.data.deviceTypes.find(
        item => item.key === match.params.deviceTypeKey,
      );

      let properties;
      if (!device) {
        properties = [];
        deviceType.properties.forEach(property => properties.push({ key: property.key, val: property.defaultValue }));
      } else {
        properties = device.properties;
      }

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
    if (!e.target) return;
    let { value } = e.target;
    if (e.target.type === 'checkbox') value = e.target.checked.toString();
    let indexOfProperty = this.state.device.properties.findIndex(
      property => property.key === propertyKey,
    );

    if (indexOfProperty === -1) {
      this.state.device.properties.push({ val: value, key: propertyKey });
      indexOfProperty = this.state.device.properties.length - 1;
    }

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

  closeForm = (deleted) => {
    const { match, history, returnFunc } = this.props;

    if (returnFunc) returnFunc(deleted);
    history.push(
      `/experiments/${match.params.id}/${DEVICE_TYPES_DASH}/${match.params.deviceTypeKey}/${DEVICES}`,
    );
  };

  submitDevice = async (newDevice, deleted) => {
    const newEntity = newDevice;
    const { match, client, returnFunc } = this.props;
    const { deviceType } = this.state;
    if (deleted) newEntity.state = 'Deleted';
    let property;
    let invalid;
    if (deviceType.properties) {
      deviceType.properties.forEach((p) => {
        property = newEntity.properties.find(ntp => ntp.key === p.key);
        if (!property) {
          property = {
            key: p.key,
            val: this.getValue(p.key, p.defaultValue)
          };
          newEntity.properties.push(property);
        }
        if (p.required && !p.trialField && !property.val) {
          invalid = true;
          property.invalid = true;
        } else {
          delete property.invalid;
        }
      });
      if (invalid) {
        this.setState({ tabValue: 0 });
        return;
      }
    }
    await client.mutate({
      mutation: deviceMutation(newEntity),
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

    this.closeForm(deleted);
  };

  getValue = (key) => {
    const { properties } = this.state.device;
    const p = ((properties && properties.length) ? properties.findIndex(pr => pr.key === key) : -1);
    return (p !== -1 ? properties[p].val : '');
  }

  getInvalid = (key) => {
    const properties = this.state.device.properties;
    const p = ((properties && properties.length) ? properties.findIndex(pr => pr.key === key) : -1);
    return (p !== -1 ? properties[p].invalid : false);
  }

  render() {
    const { classes } = this.props;
    const { deviceType, device } = this.state;

    return (
      <>
        <ContentHeader
          title={`Add ${deviceType.name}`}
          className={classes.header}
        />
        <Typography style={{ marginBottom: '100px' }}>
          <CustomInput
            id="device-name"
            className={classes.property}
            onChange={e => this.onInputChange(e, 'name')}
            label="Name"
            bottomDescription="a short description"
            value={device.name}
          />
          <CustomInput
            id="device-id"
            className={classes.property}
            onChange={e => this.onInputChange(e, 'id')}
            label="ID"
            bottomDescription="a short description"
            value={device.id}
          />
          {deviceType.properties
            ? deviceType.properties.filter(p => p.trialField !== true).map(property => (
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
                invalid={this.getInvalid(property.key)}
              />
            ))
            : null}
        </Typography>
        <Footer
          cancelButtonHandler={this.closeForm}
          saveButtonHandler={() => this.submitDevice(this.state.device)}
          withDeleteButton={this.props.device}
          deleteButtonHandler={() => this.submitDevice(device, true)}
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
