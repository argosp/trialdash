import gql from 'graphql-tag';

const addUpdateLabel = (experimentId, labelName, color) => {

  return gql`
  mutation {
    addUpdateLabel(
      experimentId:"${experimentId}",
      uid: "${localStorage.getItem('uid')}",
      name: "${labelName}",
      color: "${color}"
    ) {
        key
        name 
        color
      }
      }`
};


export default addUpdateLabel;
