import gql from 'graphql-tag';

export default data => gql`
  mutation {
    addUpdateData(
        uid: "${localStorage.getItem('uid')}",
        experimentId:"${data.experimentId}"
        id: "${data.id}",
        name: "${data.name}",
        type: "${data.type}",
        ) {
            id
            name
            type
        }
    }
    `;
