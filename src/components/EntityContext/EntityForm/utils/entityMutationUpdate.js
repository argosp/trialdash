import gql from 'graphql-tag';
import { ENTITY_MUTATION } from '../../../../constants/base';

export default (entity) => {

  return gql`mutation {
        ${ENTITY_MUTATION}(
            action: "update",
            key: "${entity.key}",
            uid:"${localStorage.getItem('uid')}"
            experimentId:"${entity.experimentId}"
            ${entity.name ? `name:"${entity.name}"` : ''},
            ${entity.entitiesTypeKey ? `entitiesTypeKey:"${entity.entitiesTypeKey}"` : ''},
            ${entity.state ? `state:"${entity.state}"` : ''}
            ${entity.properties ? `properties:${JSON.stringify(entity.properties).replace(/"key":/g, 'key:').replace(/"val":/g, 'val:')}` : ''}
            ){
            key
            name
            entitiesTypeKey
            state
            properties {
              key
              val
            }
        }
      }`;
};
