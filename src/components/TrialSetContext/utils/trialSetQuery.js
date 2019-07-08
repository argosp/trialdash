import gql from 'graphql-tag'

const trialSets = experimentId => {
  return gql`
  {
      trialSets(experimentId:"${experimentId}"){
       id
       begin
       end
       type
       properties{
        key
        val
      }
     }
  }`
}

export default trialSets;