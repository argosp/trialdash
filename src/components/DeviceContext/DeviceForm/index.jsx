import React from 'react';
import { withStyles } from '@material-ui/core';
// import DeviceFormPanel from '../DeviceFormPanel';
// import deviceMutation from './utils/deviceMutation';
// import Graph from '../../../apolloGraphql';
import { DEVICES_CONTENT_TYPE } from '../../../constants/base';
// import deviceTypeMutation from '../utils/deviceTypeMutation';
import ContentHeader from '../../ContentHeader';
import CustomInput from '../../CustomInput';
import { styles } from './styles';
import Footer from '../../Footer';

// const graphql = new Graph();

class DeviceForm extends React.Component {
    cancelForm = () => {
      this.props.changeContentType(DEVICES_CONTENT_TYPE);
    };

    /*  submitDevice = async (newDevice) => {
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

      const updatedDeviceType = this.props.deviceType;
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
    }; */

    render() {
      const { deviceType, classes } = this.props;
      return (
        <>
          <ContentHeader
            title="Device name"
            topDescription={deviceType.name}
            rightDescription="Device ID"
            className={classes.header}
          />
          {deviceType.properties ? deviceType.properties.map(property => (
            <CustomInput
              className={classes.attribute}
              key={property.key}
              value={property.val || ''}
              label={property.type}
              bottomDescription="a short description of what it means to add a device here"
            />
          )) : null}
          <Footer withDeleteButton cancelButtonHandler={this.cancelForm} />
        </>
      );
    }
}

export default withStyles(styles)(DeviceForm);
