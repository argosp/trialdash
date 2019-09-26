import gql from 'graphql-tag';

export default experiment => gql`mutation {
        addUpdateExperiment(
            uid:"${localStorage.getItem('uid')}"
            id:"${experiment.id}"
            name:"${experiment.name}"
            begin:"${experiment.begin}"
            end:"${experiment.end}"
          ){
            id
        }
      }`;
