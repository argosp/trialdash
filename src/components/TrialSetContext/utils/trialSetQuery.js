import gql from 'graphql-tag';

const trialSets = experimentId => gql`
  {
      trialSets(experimentId:"${experimentId}"){
       id
       name
       description
       numberOfTrials
       properties{
        key
        val
        type
      }
     }
  }`;

export default trialSets;
