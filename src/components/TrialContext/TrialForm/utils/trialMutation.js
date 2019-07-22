import gql from 'graphql-tag';

export default (trial) => {
    var id = trial.id ? trial.id : `${trial.experimentId}_${Date.now()}`; 
    return gql`mutation {
        addUpdateTrial(
            uid:"${localStorage.getItem('uid')}"
            experimentId:"${trial.experimentId}"
            id:"${id}"
            name:"${trial.name}"
            begin:"${trial.begin}"
            end:"${trial.end}"
            device: "${trial.device}"
            trialSet: "${trial.trialSet}"
            properties: ${JSON.stringify(trial.properties).replace(/\"key\":/g, 'key:').replace(/\"val\":/g, 'val:')}
            ){
            id
        }
      }`
}