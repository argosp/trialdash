import gql from 'graphql-tag';

const trials = (experimentId, trialSetKey) => gql`
  {
      trials(experimentId:"${experimentId}", trialSetKey:"${trialSetKey}"){
        key
        name
        created
        status
        cloneFrom
        state
        trialSetKey
        numberOfDevices
        properties {
          key
          val
        }
        entities {
          key
          typeKey
          type
          properties {
            key
            val
          }
        }
        deployedEntities {
          key
          typeKey
          type
          properties {
            key
            val
          }
        }
      }
  }`;

export default trials;
