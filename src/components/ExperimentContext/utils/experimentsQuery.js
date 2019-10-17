import gql from 'graphql-tag';

export default gql`
{
    experiments{
        id
        name
        description
        begin
        end
        location
        status
        numberOfTrials
    }
}`;
