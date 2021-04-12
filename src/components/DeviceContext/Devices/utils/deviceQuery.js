import gql from 'graphql-tag';

const devices = (experimentId, deviceTypeKey) => gql`
  {
      devices(experimentId:"${experimentId}",${deviceTypeKey ? `deviceTypeKey:"${deviceTypeKey}"` : ''}){
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
