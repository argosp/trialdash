import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import AddForm from '../../AddForm';
import DeviceFormPanel from '../DeviceFormPanel';
import deviceMutation from './utils/deviceMutation';
import Graph from '../../../apolloGraphql';

const graphql = new Graph();

class DeviceForm extends React.Component {
    state = {
      id: this.props.id || null,
      name: this.props.name || 'Device name',
      height: this.props.height || '',
      sku: this.props.sku || '',
      brand: this.props.brand || '',
    };

  submitDevice = () => {
    const newDevice = {
      id: this.state.id,
      experimentId: this.props.experimentId,
      name: this.state.name,
      height: this.state.height,
      sku: this.state.sku,
      brand: this.state.brand,
      deviceType: this.props.deviceType.id,
    };

    graphql
      .sendMutation(deviceMutation(newDevice))
      .then((data) => {
        window.alert(
          `saved ${data.addUpdateDevice.id}`,
        );
        // this.props.showAll();
      })
      .catch((err) => {
        window.alert(`error: ${err}`);
      });
  };

  render() {
    return (
      <AddForm
        saveFormHandler={this.submitDevice}
        rightPanel={<DeviceFormPanel />}
        // cancelFormHandler={}
        withFooter
        headerTitle="Add device"
        headerDescription="a short description of what it means to add a device here"
        commonInputs={[
          {
            key: 0,
            id: 'device-name',
            label: 'Device Name',
            description: 'a short description about the device name',
            placeholder: 'Search Devices',
          },
          {
            key: 1,
            id: 'device-id',
            label: 'Device ID',
            description: 'a short description about the device name',
            placeholder: 'Search Devices',
          },
        ]}
      />
    );
  }
}

export default withStyles(styles)(DeviceForm);
