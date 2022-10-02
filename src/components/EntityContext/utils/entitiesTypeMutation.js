import gql from 'graphql-tag';
import { ENTITIES_TYPE_MUTATION } from '../../../constants/base';

export default (entitiesType) => {
  const key = entitiesType.key ? entitiesType.key : `${entitiesType.experimentId}_${Date.now()}`;

  return gql`
    mutation {
    ${ENTITIES_TYPE_MUTATION}(
            uid: "${localStorage.getItem('uid')}",
            experimentId:"${entitiesType.experimentId}",
            key: "${key}",
            name: "${entitiesType.name}",
            numberOfEntities: ${entitiesType.numberOfEntities},
            ${entitiesType.state ? `state:"${entitiesType.state}"` : ''}
            properties: ${JSON.stringify(entitiesType.properties)
              .replace(/"key":/g, 'key:')
              .replace(/"type":/g, 'type:')
              .replace(/"label":/g, 'label:')
              .replace(/"description":/g, 'description:')
              .replace(/"prefix":/g, 'prefix:')
              .replace(/"suffix":/g, 'suffix:')
              .replace(/"required":/g, 'required:')
              .replace(/"template":/g, 'template:')
              .replace(/"multipleValues":/g, 'multipleValues:')
              .replace(/"trialField":/g, 'trialField:')
              .replace(/"static":/g, 'static:')
              .replace(/"value":/g, 'value:')
              .replace(/"defaultValue":/g, 'defaultValue:')
              .replace(/"defaultProperty":/g, 'defaultProperty:')
              .replace(/"inheritable":/g, 'inheritable:')}
            ) {
                key
                name
                numberOfEntities
                state
                properties {
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
        }
        `;
};
