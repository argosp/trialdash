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
        numberOfEntities
        properties {
          key
          val
        }
        entities 
        deployedEntities
      }
  }`;

export default trials;
