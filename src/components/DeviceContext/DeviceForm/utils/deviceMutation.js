import gql from 'graphql-tag';

export default (device) => {
  const key = device.key ? device.key : `${device.experimentId}_${Date.now()}`;

  return gql`mutation {
        addUpdateDevice(
            key: "${key}",
            uid:"${localStorage.getItem('uid')}"
            experimentId:"${device.experimentId}"
            id:"${device.id}"
            name:"${device.name}"
            deviceTypeKey: "${device.deviceTypeKey}"
            properties: ${JSON.stringify(device.properties)
    .replace(/"key":/g, 'key:')
    .replace(/"val":/g, 'val:')
}
            ){
            key
            id
            name
            deviceTypeKey
            properties {
              key
              val
            }
        }
      }`;
};
