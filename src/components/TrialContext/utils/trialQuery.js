import gql from 'graphql-tag';

const trials = (experimentId, trialSetKey) => gql`
  {
      trials(experimentId:"${experimentId}", trialSetKey:"${trialSetKey}"){
        id
        name
        notes
        begin
        end
        trialSet {
          id
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
        devices {
          entity {
            id
            name
          }
          properties {
              key
              val
          }
          name
      }
      assets {
        entity {
          id
          name
        }
        properties {
            key
            val
        }
        name
      }
    }
  }`;

export default trials;
