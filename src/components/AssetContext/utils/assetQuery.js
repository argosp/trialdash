import gql from 'graphql-tag';

const assets = (experimentId, entityType) => gql`
  {
     assets(experimentId:"${experimentId}", entityType:"${entityType}"){
       name
       notes
       type
       number
       properties{
           key
           val
           type
        }
     }
  }`;

export default assets;
