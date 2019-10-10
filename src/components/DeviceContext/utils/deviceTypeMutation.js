import gql from 'graphql-tag';

export default (deviceType) => {
  const id = deviceType.id
    ? deviceType.id
    : `${deviceType.experimentId}_${Date.now()}`;
  return gql`
    mutation {
    addUpdateDeviceTypes(
            uid: "${localStorage.getItem('uid')}",
            experimentId:"${deviceType.experimentId}"
            id: "${id}",
            name: "${deviceType.name}",
            numberOfDevices: ${deviceType.numberOfDevices},
            numberOfFields: ${deviceType.numberOfFields},
            properties: ${JSON.stringify(deviceType.properties)
    .replace(/"key":/g, 'key:')
    .replace(/"type":/g, 'type:')
    .replace(/"id":/g, 'id:')
    .replace(/"label":/g, 'label:')
    .replace(/"description":/g, 'description:')
    .replace(/"prefix":/g, 'prefix:')
    .replace(/"suffix":/g, 'suffix:')
    .replace(/"required":/g, 'required:')
    .replace(/"template":/g, 'template:')
    .replace(/"multipleValues":/g, 'multipleValues:')
    .replace(/"trialField":/g, 'trialField:')
}
            ) {
                name
            }
        }
        `;
};
