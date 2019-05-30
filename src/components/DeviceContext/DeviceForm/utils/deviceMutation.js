import gql from 'graphql-tag';

export default (device) => {   
    return gql`
  mutation {
    addUpdateDevice(
        uid: "${localStorage.getItem('uid')}",
        id: "${device.id}",
        name: "${device.name}",
        type: "${device.type}",
        properties: [{key: "heat degrees", val: "12"}]
        ) {
            id
            name
            type
            properties{
                key
                val
             }
        }
    }
    `
}
