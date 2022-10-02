import gql from 'graphql-tag';

const trialSets = (experimentId) => gql`
  {
      trialSets(experimentId:"${experimentId}"){
       key
       name
       description
       numberOfTrials
       state
       properties{
           key
           type
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
