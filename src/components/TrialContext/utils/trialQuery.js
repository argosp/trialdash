import gql from 'graphql-tag'

const trials = experimentId => {
  return gql`
  {
      trials(experimentId:"${experimentId}"){
        id
        name
        begin
        end
        trialSet {
          id
          type
          name
          properties {
              key
              val
           }
        }
        properties {
          key
          val
       }
        device {
          id
          name
          type
          properties {
              key
              val
           }
      }
    }
  }`
}

export default trials;