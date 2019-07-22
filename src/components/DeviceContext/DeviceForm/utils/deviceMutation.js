import gql from 'graphql-tag';

export default (device) => {   
    return gql`
  mutation {
    addUpdateDevice(
        uid: "${localStorage.getItem('uid')}",
        experimentId:"${device.experimentId}"
        id: "${device.id}",
        name: "${device.name}",
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
