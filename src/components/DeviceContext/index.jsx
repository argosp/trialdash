import React from 'react';
import Devices from './Devices';
import {
  DEVICE_FORM_CONTENT_TYPE,
  DEVICE_TYPE_FORM_CONTENT_TYPE,
  DEVICE_TYPES_CONTENT_TYPE,
  DEVICES_CONTENT_TYPE,
} from '../../constants/base';
import DeviceTypes from './DeviceTypes';
import AddSetForm from '../AddSetForm';
import DeviceForm from './DeviceForm';

class DeviceMainView extends React.PureComponent {
    state = {
      currentContentType: DEVICE_TYPES_CONTENT_TYPE,
      selectedDeviceType: null,
    };

    switchCurrentContentType = (contentType) => {
      this.setState({ currentContentType: contentType });
    };

    selectDeviceType = (deviceType) => {
      this.setState({ selectedDeviceType: deviceType });
    };

    renderContent = (contentType) => {
      const { experimentId, entityType } = this.props;
      const { selectedDeviceType } = this.state;

      switch (contentType) {
        case DEVICE_TYPES_CONTENT_TYPE:
        default:
          return (
            <DeviceTypes
              experimentId={experimentId}
              entityType={entityType}
              changeContentType={this.switchCurrentContentType}
              selectDeviceType={this.selectDeviceType}
            />
          );
        case DEVICES_CONTENT_TYPE:
          return (
            <Devices
              experimentId={experimentId}
              deviceTypeKey={selectedDeviceType.key}
              changeContentType={this.switchCurrentContentType}
            />
          );
        case DEVICE_TYPE_FORM_CONTENT_TYPE:
          return (
            <AddSetForm
              type={DEVICE_TYPES_CONTENT_TYPE}
              experimentId={experimentId}
              changeContentType={this.switchCurrentContentType}
            />
          );
        case DEVICE_FORM_CONTENT_TYPE:
          return (
            <DeviceForm
              experimentId={experimentId}
              deviceType={selectedDeviceType}
              changeContentType={this.switchCurrentContentType}
            />
          );
      }
    };

    render() {
      return <>{this.renderContent(this.state.currentContentType)}</>;
    }
}

export default DeviceMainView;
