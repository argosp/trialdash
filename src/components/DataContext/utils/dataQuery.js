import gql from 'graphql-tag';

const data = experimentId => gql`
  {
    experimentData(experimentId:"${experimentId}"){
       project
       id
       name
       description
       begin
       end
       location
       numberOfTrials
    }
  }`;

export default data;
