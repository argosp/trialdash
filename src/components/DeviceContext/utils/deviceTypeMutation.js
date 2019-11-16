import gql from 'graphql-tag';
import { DEVICE_TYPE_MUTATION } from '../../../constants/base';

export default (deviceType) => {
  const key = deviceType.key
    ? deviceType.key
    : `${deviceType.experimentId}_${Date.now()}`;

  return gql`
    mutation {
    ${DEVICE_TYPE_MUTATION}(
            uid: "${localStorage.getItem('uid')}",
            experimentId:"${deviceType.experimentId}",
            key: "${key}",
            id: "${deviceType.id}",
            name: "${deviceType.name}",
            numberOfDevices: ${deviceType.numberOfDevices},
            properties: ${JSON.stringify(deviceType.properties)
    .replace(/"key":/g, 'key:')
    .replace(/"type":/g, 'type:')
    .replace(/"id":/g, 'id:')
    .replace(/"label":/g, 'label:')
    .replace(/"description":/g, 'description:')
    .replace(/"prefix":/g, 'prefix:')
    .replace(/"suffix":/g, 'suffix:')
    .replace(/"required":/g, 'required:')
    .replace(/"template":/g, 'template:')
    .replace(/"multipleValues":/g, 'multipleValues:')
    .replace(/"trialField":/g, 'trialField:')
}
            ) {
                key
                id
                name
                numberOfDevices
                properties {
                  key
                  type
                  id
                  label
                  description
                  prefix
                  suffix
                  required
                  template
                  multipleValues
                  trialField
                }
            }
        }
        `;
};
