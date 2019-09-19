import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import AddForm from '../../AddForm';
import DeviceFormPanel from '../DeviceFormPanel';

const DeviceForm = () => (
  <AddForm
    rightPanel={<DeviceFormPanel />}
    // cancelFormHandler={}
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

export default withStyles(styles)(DeviceForm);
