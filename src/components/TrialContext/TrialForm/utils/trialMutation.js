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

export default (trial) => {
  const key = trial.key ? trial.key : `${trial.experimentId}_${Date.now()}`;

  return gql`mutation {
        ${TRIAL_MUTATION}(
            key:"${key}",
            uid:"${localStorage.getItem('uid')}"
            experimentId:"${trial.experimentId}"
            id:"${trial.id}"
            name:"${trial.name}"
            trialSetKey:"${trial.trialSetKey}"
            numberOfDevices:${trial.numberOfDevices}
            properties: ${JSON.stringify(trial.properties)
    .replace(/"key":/g, 'key:')
    .replace(/"val":/g, 'val:')
}
            ){
              key
              created
              status
              id
              name
              trialSetKey
              numberOfDevices
              properties {
                key
                val
              }
            }
      }`;
};
