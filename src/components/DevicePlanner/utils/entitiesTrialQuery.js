import gql from 'graphql-tag';

const devicesTrialQuery = (experimentId, deviceTypeKey, trialKey) => gql`
  {
    entities(experimentId:"${experimentId}", deviceTypeKey:"${deviceTypeKey}"${trialKey ? `, trialKey:"${trialKey}"` : ''}){
      key
      name
      deviceTypeKey
      properties{
        key
        val
      }
    }
  }`;

export default devicesTrialQuery;