import gql from 'graphql-tag';

const trialSets = experimentId => gql`
  {
      trialSets(experimentId:"${experimentId}"){
       id
       name
       notes
       type
       properties{
        key
        val
      }
     }
  }`;

export default trialSets;
