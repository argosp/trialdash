import gql from 'graphql-tag';

const devices = (experimentId, deviceTypeKey) => gql`
  {
      devices(experimentId:"${experimentId}", deviceTypeKey:"${deviceTypeKey}"){
        id
        key
        name
        state
        properties {
           key
           val
        }
      }
  }`;

export default devices;
