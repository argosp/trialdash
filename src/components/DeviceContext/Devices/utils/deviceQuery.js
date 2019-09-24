import gql from 'graphql-tag';

const devices = (experimentId, deviceTypeId) => gql`
  {
      devices(experimentId:"${experimentId}", deviceTypeId:"${deviceTypeId}"){
        id
        name
        height
        sku
        brand
        deviceType {
          id
        }
      }
  }`;

export default devices;
