import gql from 'graphql-tag';

export default (asset) => {
    var id = asset.id ? asset.id : `${asset.experimentId}_${Date.now()}`; 
    return gql`
  mutation {
    addUpdateAsset(
        uid: "${localStorage.getItem('uid')}",
        experimentId:"${asset.experimentId}"
        id: "${id}",
        name: "${asset.name}",
        type: "${asset.type}",
        number: "${asset.number}",
        entityType: "${asset.entityType}",
        properties: ${JSON.stringify(asset.properties).replace(/\"key\":/g, 'key:').replace(/\"val\":/g, 'val:')}
        ) {
            id
            name
            type
            number
            properties{
                key
                val
                type
             }
        }
    }
    `
}
