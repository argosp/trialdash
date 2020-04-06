import gql from 'graphql-tag';

const trialSets = experimentId => gql`
  {
      trialSets(experimentId:"${experimentId}"){
       id
       key
       name
       description
       numberOfTrials
       state
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
           value
      }
     }
  }`;

export default trialSets;
