import React from 'react';
import AddForm from '../../AddForm';
import DeviceFormPanel from '../DeviceFormPanel';
import deviceMutation from './utils/deviceMutation';
import Graph from '../../../apolloGraphql';

const graphql = new Graph();

class DeviceForm extends React.Component {
  submitDevice = (newDevice) => {
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
        initialState={{
          experimentId: this.props.experimentId,
          deviceType: this.props.deviceType.id,
          id: '',
          name: '',
          height: '',
          sku: '',
          brand: '',
        }}
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
            label: 'Name',
            description: 'a short description about the device name',
            placeholder: 'Value',
          },
          {
            key: 1,
            id: 'device-id',
            label: 'ID',
            description: 'a short description about the device name',
            placeholder: 'Value',
          },
        ]}
      />
    );
  }
}

export default DeviceForm;
