import gql from 'graphql-tag';

const devices = (experimentId, deviceTypeKey) => gql`
  {
      devices(experimentId:"${experimentId}",${deviceTypeKey ? `deviceTypeKey:"${deviceTypeKey}"` : ''}){
        id
        key
        name
        state
        deviceTypeKey
        properties {
           key
           val
        }
      }
  }`;

export default devices;
