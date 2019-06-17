import gql from 'graphql-tag'

const trials = experimentId => {
  return gql`
  {
      trials(experimentId:"${experimentId}"){
        id
        name
        begin
        end
        device {
          id
          name
          type
          properties {
              key
              val
           }
          position
      }
    }
  }`
}

export default trials;