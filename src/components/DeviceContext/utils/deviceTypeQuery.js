import gql from 'graphql-tag';

const deviceTypes = experimentId => gql`
 {
    deviceTypes(experimentId:"${experimentId}"){
       id
       name
       numberOfDevices
       numberOfFields
       properties{
           key
           val
           type
        }
     }
  }
  `;

export default deviceTypes;
