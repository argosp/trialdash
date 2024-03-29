import gql from 'graphql-tag';
import { TRIAL_MUTATION } from '../../../../constants/base';

/* function cleanEntity(entity) {
  return JSON.stringify(entity)
    .replace(/"entity":/g, 'entity:')
    .replace(/"name":/g, 'name:')
    .replace(/"properties":/g, 'properties:')
    .replace(/"key":/g, 'key:')
    .replace(/"val":/g, 'val:')
    .replace(/"type":/g, 'type:');
} */

export default (trial, changedEntities) => {
  const key = trial.key ? trial.key : `${trial.experimentId}_${Date.now()}`;
  return gql`mutation {
        ${TRIAL_MUTATION}(
            key:"${key}",
            action: "${trial.action}",
            uid:"${localStorage.getItem('uid')}",
            experimentId:"${trial.experimentId}",
            name:"${trial.name}",
            status:"${trial.status}",
            ${trial.cloneFrom ? `cloneFrom:"${trial.cloneFrom}"` : ''},
            ${trial.cloneFromTrailKey ? `cloneFromTrailKey:"${trial.cloneFromTrailKey}"` : ''},
            trialSetKey:"${trial.trialSetKey}",
            numberOfEntities:${trial.numberOfEntities},
            ${trial.state ? `state:"${trial.state}"` : ''},
            ${changedEntities ? `changedEntities: ${JSON.stringify(changedEntities)
      .replace(/"key":/g, 'key:')
      .replace(/"val":/g, 'val:')
      .replace(/"type":/g, 'type:')
      .replace(/"entitiesTypeKey":/g, 'entitiesTypeKey:')
      .replace(/"properties":/g, 'properties:')
      .replace(/"containsEntities":/g, 'containsEntities:')}` : ''},
            properties: ${JSON.stringify(trial.properties)
      .replace(/"key":/g, 'key:')
      .replace(/"val":/g, 'val:')},
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
      .replace(/"containsEntities":/g, 'containsEntities:')}` : ''},

            )
            {
              key
              created
              status
              cloneFrom
              cloneFromTrailKey
              name
              trialSetKey
              numberOfEntities
              state
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
              error
            }
      }`;
};
