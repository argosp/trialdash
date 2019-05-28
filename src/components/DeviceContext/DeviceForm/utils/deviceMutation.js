import gql from 'graphql-tag';

export default (device) => {   
    return gql`mutation {
        InsertDevice(
            uid:"${localStorage.getItem('uid')}"
            deviceCustomId:"${device.deviceCustomId}"
            experimentId:"${device.experimentId}"
            parent:"${device.collection}"
          ){
            id
            status
            title
            error
        }
      }`
}