import gql from 'graphql-tag'

const trialSets = experimentId => {
  return gql`
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
  }`
}

export default trialSets;