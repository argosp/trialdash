import gql from 'graphql-tag';
import { DEVICE_MUTATION } from '../../../../constants/base';

export default (device) => {

  return gql`mutation {
        ${DEVICE_MUTATION}(
            action: "update",
            key: "${device.key}",
            uid:"${localStorage.getItem('uid')}"
            experimentId:"${device.experimentId}"
            ${device.name ? `name:"${device.name}"` : ''},
            ${device.deviceTypeKey ? `deviceTypeKey:"${device.deviceTypeKey}"` : ''},
            ${device.state ? `state:"${device.state}"` : ''}
            ${device.properties ? `properties:${JSON.stringify(device.properties).replace(/"key":/g, 'key:').replace(/"val":/g, 'val:')}` : ''}
            ){
            key
            name
            deviceTypeKey
            state
            properties {
              key
              val
            }
        }
      }`;
};
