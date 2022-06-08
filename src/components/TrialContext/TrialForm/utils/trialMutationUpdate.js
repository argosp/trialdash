import gql from 'graphql-tag';
import { TRIAL_MUTATION } from '../../../../constants/base';

export default (trial, changedEntities) => {
  const key = trial.key ? trial.key : `${trial.experimentId}_${Date.now()}`;

  return gql`mutation {
        ${TRIAL_MUTATION}(
          action: "update",
          key:"${key}",
          uid:"${localStorage.getItem('uid')}"
          experimentId:"${trial.experimentId}"
          ${trial.name ? `name:"${trial.name}"` : ''},
          ${trial.status ? `status:"${trial.status}"` : ''},
          trialSetKey:"${trial.trialSetKey}",
          ${trial.numberOfEntities ? `numberOfEntities:"${trial.numberOfEntities}"` : ''},
          ${trial.state ? `state:"${trial.state}"` : ''},
          ${changedEntities ? `changedEntities: ${JSON.stringify(changedEntities)
            .replace(/"key":/g, 'key:')
            .replace(/"val":/g, 'val:')
            .replace(/"type":/g, 'type:')
            .replace(/"entitiesTypeKey":/g, 'entitiesTypeKey:')
            .replace(/"properties":/g, 'properties:')
            .replace(/"containsEntities":/g, 'containsEntities:')}` : ''},
          ${trial.properties ? `properties:${JSON.stringify(trial.properties)
    .replace(/"key":/g, 'key:')
    .replace(/"val":/g, 'val:')}` : ''}
          ${trial.entities ? `entities: ${JSON.stringify(trial.entities)
    .replace(/"key":/g, 'key:')
    .replace(/"val":/g, 'val:')
    .replace(/"type":/g, 'type:')
    .replace(/"entitiesTypeKey":/g, 'entitiesTypeKey:')
    .replace(/"properties":/g, 'properties:')
    .replace(/"containsEntities":/g, 'containsEntities:')}` : ''},
        ${trial.deployedEntities ? `deployedEntities: ${JSON.stringify(trial.deployedEntities)
    .replace(/"key":/g, 'key:')
    .replace(/"val":/g, 'val:')
    .replace(/"type":/g, 'type:')
    .replace(/"entitiesTypeKey":/g, 'entitiesTypeKey:')
    .replace(/"properties":/g, 'properties:')
    .replace(/"containsEntities":/g, 'containsEntities:')}` : ''}
            )
            {
              key
              created
              status
              name
              trialSetKey
              numberOfEntities
              state
              error
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
      }`;
};
