import gql from 'graphql-tag';

export default (device) => {
  const id = device.id ? device.id : `${device.experimentId}_${Date.now()}`;
  return gql`mutation {
        addUpdateDevice(
            uid:"${localStorage.getItem('uid')}"
            experimentId:"${device.experimentId}"
            id:"${id}"
            name:"${device.name}"
            height:"${device.height}"
            sku:"${device.sku}"
            brand:"${device.brand}"
            deviceType: "${device.deviceType}"
            ){
            id
        }
      }`;
};
