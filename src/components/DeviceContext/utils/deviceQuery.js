import gql from 'graphql-tag'

const devices = experimentId => {
  return gql`
 	{
     devices(experimentId:"${experimentId}"){
       id
       name
       type
       number
       properties{
           key
           val
        }
     }
  }`
}

export default devices;