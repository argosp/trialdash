import gql from 'graphql-tag';

export default (trial) => {   
    return gql`mutation {
        InsertTrial(
            uid:"${localStorage.getItem('uid')}"
            trialCustomId:"${trial.trialCustomId}"
            experimentId:"${trial.experimentId}"
            parent:"${trial.collection}"
          ){
            id
            status
            title
            error
        }
      }`
}