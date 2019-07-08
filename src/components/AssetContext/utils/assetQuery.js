import gql from 'graphql-tag'

const assets = experimentId => {
  return gql`
  {
      assets(experimentId:"${experimentId}"){
       id
       name
       type
     }
  }`
}

export default assets;