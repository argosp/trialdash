import gql from 'graphql-tag';

const trials = (experimentId, trialSetId) => gql`
  {
      trials(experimentId:"${experimentId}", trialSetId:"${trialSetId}"){
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
