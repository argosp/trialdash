import gql from 'graphql-tag';

export default (trialSet) => {
  const key = trialSet.key
    ? trialSet.key
    : `${trialSet.experimentId}_${Date.now()}`;

  return gql`
  mutation {
    addUpdateTrialSet(
        uid: "${localStorage.getItem('uid')}",
        experimentId:"${trialSet.experimentId}"
        key: "${key}",
        id: "${trialSet.id}",
        name: "${trialSet.name}",
        description: "${trialSet.description}",
        numberOfTrials: ${trialSet.numberOfTrials},
        properties: ${JSON.stringify(trialSet.properties)
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
    .replace(/"trialField":/g, 'trialField:')}
        ) {
            key
            id
            name
            description
            numberOfTrials
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
