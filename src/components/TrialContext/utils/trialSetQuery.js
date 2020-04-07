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
           required
           template
           multipleValues
           value
           defaultValue
      }
     }
  }`;

export default trialSets;
