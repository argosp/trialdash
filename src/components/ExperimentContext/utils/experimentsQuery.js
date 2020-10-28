import gql from 'graphql-tag';

export default gql`
{
    experimentsWithData{
        id
        name
        description
        begin
        end
        location
        numberOfTrials
        key
        state
        status
        project {
          id
          name
          description
        }
        maps{
          imageUrl
          imageName
          lower
          upper
          left
          right
          width
          height
          embedded
        }
    }
}`;
