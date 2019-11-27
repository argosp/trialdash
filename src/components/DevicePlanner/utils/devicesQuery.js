import gql from 'graphql-tag';

const devices = (experimentId, deviceTypeKey) => gql`
  {
    devices(experimentId:"${experimentId}", deviceTypeKey:"${deviceTypeKey}"){
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
