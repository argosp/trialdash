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
            name: "${deviceType.name}",
            numberOfDevices: ${deviceType.numberOfDevices},
            ${deviceType.state ? `state:"${deviceType.state}"` : ''}
            properties: ${JSON.stringify(deviceType.properties)
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
    .replace(/"value":/g, 'value:')
    .replace(/"defaultValue":/g, 'defaultValue:')
    .replace(/"defaultProperty":/g, 'defaultProperty:')
}
            ) {
                key
                name
                numberOfDevices
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
                  value
                  defaultValue
                  defaultProperty
                }
            }
        }
        `;
};
