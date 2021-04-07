import gql from 'graphql-tag';

const data = experimentId => gql`
  {
    experimentData(experimentId:"${experimentId}"){
       project {
        id
        name
        description
        status
       }
       name
       description
       begin
       end
       location
       numberOfTrials
       maps {
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

export default data;
