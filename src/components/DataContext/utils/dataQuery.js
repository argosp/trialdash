import gql from 'graphql-tag';

const data = experimentId => gql`
  {
    experimentData(experimentId:"${experimentId}"){
       project
       id
       begin
       end
       location
       numberOfTrials
    }
  }`;

export default data;
