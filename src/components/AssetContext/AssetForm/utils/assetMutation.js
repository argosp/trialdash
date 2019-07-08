import gql from 'graphql-tag';

export default (asset) => {   
    return gql`
  mutation {
    addUpdateAsset(
        uid: "${localStorage.getItem('uid')}",
        experimentId:"${asset.experimentId}"
        id: "${asset.id}",
        name: "${asset.name}",
        type: "${asset.type}"
        ) {
            id
            name
            type
        }
    }
    `
}
