import gql from 'graphql-tag';

const trials = (experimentId, trialSetKey) => gql`
  {
      trials(experimentId:"${experimentId}", trialSetKey:"${trialSetKey}"){
        key
        name
        created
        status
        cloneFrom
        cloneFromTrailKey
        state
        trialSetKey
        numberOfEntities
        properties {
          key
          val
        }
        entities {
          key
          entitiesTypeKey
          containsEntities
          properties {
            key
            val
          }
        }
        deployedEntities {
          key
          entitiesTypeKey
          containsEntities
          properties {
            key
            val
          }
        }
      }
  }`;

export default trials;
