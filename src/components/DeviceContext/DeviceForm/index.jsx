import React from 'react';
import AddForm from '../../AddForm';
import DeviceFormPanel from '../DeviceFormPanel';
import deviceMutation from './utils/deviceMutation';
import Graph from '../../../apolloGraphql';
import { DEVICES_CONTENT_TYPE } from '../../../constants/base';
import deviceTypeMutation from '../DeviceTypeForm/utils/deviceTypeMutation';

const graphql = new Graph();

class DeviceForm extends React.Component {
  cancelForm = () => {
    this.props.changeContentType(DEVICES_CONTENT_TYPE);
  };

  submitDevice = async (newDevice) => {
    await graphql
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

    const updatedDeviceType = this.props.selectedDeviceType;
    updatedDeviceType.numberOfDevices = +updatedDeviceType.numberOfDevices + 1;
    updatedDeviceType.experimentId = this.props.experimentId;
    if (!updatedDeviceType.properties) updatedDeviceType.properties = [];

    await graphql
      .sendMutation(deviceTypeMutation(updatedDeviceType))
      .then((data) => {
        console.log('updated device type', data.addUpdateDeviceTypes);
      })
      .catch((error) => {
        console.log('addUpdateDevice error', error);
      });
  };

  render() {
    return (
      <AddForm
        initialValues={{
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
        cancelFormHandler={this.cancelForm}
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
