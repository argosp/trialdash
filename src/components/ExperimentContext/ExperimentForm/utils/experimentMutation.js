import gql from 'graphql-tag';

export default (experiment) => {   
    return gql`mutation {
        addUpdateExperiment(
            uid:"${localStorage.getItem('uid')}"
            id:"${experiment.id}"
            name:"${experiment.name}"
            begin:"${experiment.begin}"
            end:"${experiment.end}"
          ){
            id
        }
      }`
}