import gql from 'graphql-tag';

const data = experimentId => gql`
  {
    experimentData(experimentId:"${experimentId}"){
       id
       name
       type
       begin
       end
    }
  }`;

export default data;
