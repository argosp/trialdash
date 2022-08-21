import gql from 'graphql-tag';

const entitiesTypes = (experimentId) => gql`
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
           static
           value
           defaultValue
           defaultProperty
           inheritable
        }
     }
  }
  `;

export default entitiesTypes;
