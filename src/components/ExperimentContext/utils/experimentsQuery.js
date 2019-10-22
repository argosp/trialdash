import gql from 'graphql-tag';

export default gql`
{
    experimentsWithData{
        id
        begin
        end
        location
        numberOfTrials
        project {
          id
          name
          description
          status
        }
    }
}`;
