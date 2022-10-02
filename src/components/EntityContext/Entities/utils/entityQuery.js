import gql from 'graphql-tag';

const devices = (experimentId, entitiesTypeKey) => gql`
  {
      entities(experimentId:"${experimentId}",${
  entitiesTypeKey ? `entitiesTypeKey:"${entitiesTypeKey}"` : ''
}){
        key
        name
        state
        entitiesTypeKey
        properties {
           key
           val
        }
      }
  }`;

export default devices;
