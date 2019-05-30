import gql from 'graphql-tag'

export default gql`
{
    experiments{
        name
        id
    }
}`;