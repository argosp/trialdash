import gql from 'graphql-tag';

const addUpdateLabel = (experimentId, labelData) => {
  return gql`
  mutation {
    addUpdateLabel(
      experimentId:"${experimentId}",
      uid: "${localStorage.getItem('uid')}",
      name: "${labelData.name}",
      color: "${labelData.color}",
      ${labelData.state ? `state:"${labelData.state}"` : ''},
      ${labelData.key ? `key:"${labelData.key}"` : ''}
    ) {
        key
        name 
        color
      }
      }`;
};

export default addUpdateLabel;
