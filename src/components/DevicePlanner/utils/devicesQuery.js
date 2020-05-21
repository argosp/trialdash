import gql from 'graphql-tag';

const devices = (experimentId, deviceTypeKey, trialKey) => gql`
  {
    devices(experimentId:"${experimentId}", deviceTypeKey:"${deviceTypeKey}"${trialKey ? `, trialKey:"${trialKey}"` : ''}){
      key
      id
      name
      deviceTypeKey
      properties{
        key
        val
      }
    }
  }`;

export default devices;
