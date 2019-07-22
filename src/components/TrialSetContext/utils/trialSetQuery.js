import gql from 'graphql-tag'

const trialSets = experimentId => {
  return gql`
  {
      trialSets(experimentId:"${experimentId}"){
       id
       name
       type
       properties{
        key
        val
      }
     }
  }`
}

export default trialSets;