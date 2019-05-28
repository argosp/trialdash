import gql from 'graphql-tag'

const devices = () => {
  return gql`
 	{
     devices {
       id
       name
       type
       properties{
           key
           val
        }
     }
  }`
}

export default devices;