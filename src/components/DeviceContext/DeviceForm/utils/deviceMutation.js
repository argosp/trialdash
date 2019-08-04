import gql from 'graphql-tag';

export default (device) => {
    var id = device.id ? device.id : `${device.experimentId}_${Date.now()}`;
    return gql`
  mutation {
    addUpdateDevice(
        uid: "${localStorage.getItem('uid')}",
        experimentId:"${device.experimentId}"
        id: "${id}",
        name: "${device.name}",
        notes: "${device.notes}",
        type: "${device.type}",
        number: "${device.number}",
        entityType: "${device.entityType}",
        properties: ${JSON.stringify(device.properties).replace(/\"key\":/g, 'key:').replace(/\"val\":/g, 'val:').replace(/\"type\":/g, 'type:')}
        ) {
            id
            name
            type
            number
            properties{
                key
                val
                type
             }
        }
    }
    `
}
