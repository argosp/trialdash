import gql from 'graphql-tag';

const getAllExperimentData = experimentId => gql`
  {
    getAllExperimentData(experimentId:"${experimentId}"){
      entityTypes {
        key
        name
        numberOfEntities
        properties{
          key
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
          value
          defaultValue
          defaultProperty
          inheritable
        }
      }
    entities {
      key
      name
      state
      entitiesTypeKey
      properties {
          key
          val
      }
    }
    trialSets {
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
    trials {
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
        entities {
          key
          entitiesTypeKey
          containsEntities
          properties {
            key
            val
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
    logs {
      key
      title
      comment
      labels{
        key
      }
    }
    labels {
      key
      name
      color
    }
    }
  }`;

export default getAllExperimentData;