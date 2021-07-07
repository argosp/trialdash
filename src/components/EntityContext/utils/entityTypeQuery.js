import gql from 'graphql-tag';

const deviceTypes = experimentId => gql`
 {
    entitiesTypes(experimentId:"${experimentId}"){
       key
       name
       numberOfDevices
       properties{
           key
           type
           label
           description
           prefix
           suffix
           required
           template
           multipleValues
           trialField
           value
           defaultValue
           defaultProperty
        }
     }
  }
  `;

export default deviceTypes;
