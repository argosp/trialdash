import gql from 'graphql-tag';

export default (device) => {
  const id = device.id ? device.id : `${device.experimentId}_${Date.now()}`;
  return gql`mutation {
        addUpdateDevice(
            uid:"${localStorage.getItem('uid')}"
            experimentId:"${device.experimentId}"
            id:"${id}"
            name:"${device.name}"
            deviceTypeKey: "${device.deviceTypeKey}"
            properties: ${JSON.stringify(device.properties)
    .replace(/"key":/g, 'key:')
    .replace(/"val":/g, 'val:')
}
            ){
            id
        }
      }`;
};
