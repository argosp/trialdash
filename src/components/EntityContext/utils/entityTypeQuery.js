import gql from 'graphql-tag';

const entitiesTypes = experimentId => gql`
 {
    entitiesTypes(experimentId:"${experimentId}"){
       key
       name
       numberOfEntities
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

export default entitiesTypes;
