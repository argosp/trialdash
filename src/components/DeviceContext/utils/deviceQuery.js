import gql from 'graphql-tag';

const devices = (experimentId, entityType) => {
  return gql`
 	{
     devices(experimentId:"${experimentId}", entityType:"${entityType}"){
       id
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
  }`
}

export default devices;