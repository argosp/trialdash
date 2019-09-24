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
            notes: "${deviceType.notes}",
            type: "${deviceType.type}",
            numberOfDevices: "${deviceType.numberOfDevices}",
            numberOfFields: "${deviceType.numberOfFields}",
            entityType: "${deviceType.entityType}",
            properties: ${JSON.stringify(deviceType.properties)
    .replace(/"key":/g, 'key:')
    .replace(/"val":/g, 'val:')
    .replace(/"type":/g, 'type:')}
            ) {
                id
                name
                type
                numberOfDevices
                numberOfFields
                properties{
                    key
                    val
                    type
                }
            }
        }
        `;
};
