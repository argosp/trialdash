import gql from 'graphql-tag';

const trials = (experimentId, trialSetKey) => gql`
  {
      trials(experimentId:"${experimentId}", trialSetKey:"${trialSetKey}"){
        id
        key
        name
        created
        status
        numberOfDevices
        properties {
           key
           val
        }
      }
  }`;

export default trials;
