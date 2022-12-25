import gql from "graphql-tag";

const fullTrial = (experimentId, trialKey) => gql`
  {
      trial(experimentId:"${experimentId}", trialKey:"${trialKey}"){
        key
        name
        created
        status
        cloneFrom
        cloneFromTrailKey
        state
        trialSetKey
        numberOfEntities
        properties {
          key
          val
        }
        fullDetailedEntities {
          key
          entitiesTypeKey
          entitiesTypeName
          containsEntities
          name
          properties {
            key
            val
            type
            label
            description
            prefix
            suffix
            required
            template
            multipleValues
            trialField
            static
            inheritable
            value
            defaultValue
            defaultProperty
          }
        }
        deployedEntities {
          key
          entitiesTypeKey
          containsEntities
          properties {
            key
            val
          }
        }
      }
  }`;

export default fullTrial;
