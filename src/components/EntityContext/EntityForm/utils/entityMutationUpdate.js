import gql from 'graphql-tag';
import { ENTITY_MUTATION } from '../../../../constants/base';

export default (device) => {

  return gql`mutation {
        ${ENTITY_MUTATION}(
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
