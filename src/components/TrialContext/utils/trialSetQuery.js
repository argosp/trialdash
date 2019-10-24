import gql from 'graphql-tag';

const trialSets = experimentId => gql`
  {
      trialSets(experimentId:"${experimentId}"){
       id
       key
       name
       description
       numberOfTrials
       properties{
           key
           type
           id
           label
           description
           prefix
           suffix
           required
           template
           multipleValues
           trialField
      }
     }
  }`;

export default trialSets;
