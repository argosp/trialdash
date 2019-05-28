import gql from 'graphql-tag'

const trials = experimentId => {
  return gql`
  {
      trials(experimentId:"${experimentId}"){
        id
        name
        begin
        end
        devices {
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