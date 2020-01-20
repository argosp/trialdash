import gql from 'graphql-tag';

const deviceTypes = experimentId => gql`
 {
    deviceTypes(experimentId:"${experimentId}"){
       id
       key
       name
       numberOfDevices
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
           value
        }
     }
  }
  `;

export default deviceTypes;
