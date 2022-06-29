import gql from 'graphql-tag';

const addUpdateLabel = (experimentId, labelData) => {

  return gql`
  mutation {
    addUpdateLabel(
      experimentId:"${experimentId}",
      uid: "${localStorage.getItem('uid')}",
      name: "${labelData.labelName}",
      color: "${labelData.color}",
      ${labelData.key ? `key:"${labelData.key}"` : ''}
    ) {
        key
        name 
        color
      }
      }`
};


export default addUpdateLabel;
