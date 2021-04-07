import gql from 'graphql-tag';

export default data => gql`
  mutation {
    addUpdateData(
        uid: "${localStorage.getItem('uid')}",
        experimentId:"${data.experimentId}"
        name: "${data.name}",
        type: "${data.type}",
        ) {
            name
            type
        }
    }
    `;
