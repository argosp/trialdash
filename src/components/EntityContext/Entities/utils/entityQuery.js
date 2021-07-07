import gql from 'graphql-tag';

const devices = (experimentId, deviceTypeKey) => gql`
  {
      entities(experimentId:"${experimentId}",${deviceTypeKey ? `deviceTypeKey:"${deviceTypeKey}"` : ''}){
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
