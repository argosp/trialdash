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
           type
           id
           label
           description
           prefix
           suffix
           required
           template
           multipleValues
           trialField
        }
     }
  }
  `;

export default deviceTypes;
