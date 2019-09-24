import gql from 'graphql-tag';

const deviceTypes = (experimentId, entityType) => gql`
 {
    deviceTypes(experimentId:"${experimentId}", entityType:"${entityType}"){
       id
       name
       notes
       type
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
