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
      }
     }
  }`;

export default trialSets;
