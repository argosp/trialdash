import gql from 'graphql-tag';

const trials = (experimentId, trialSetKey) => gql`
  {
      trials(experimentId:"${experimentId}", trialSetKey:"${trialSetKey}"){
        id
        key
        name
        created
        status
        state
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
      }
  }`;

export default trials;
