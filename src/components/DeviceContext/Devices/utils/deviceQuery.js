import gql from 'graphql-tag';

const devices = (experimentId, deviceTypeKey) => gql`
  {
      devices(experimentId:"${experimentId}", deviceTypeKey:"${deviceTypeKey}"){
        id
        name
        properties {
           key
           val
           }
      }
  }`;

export default devices;
