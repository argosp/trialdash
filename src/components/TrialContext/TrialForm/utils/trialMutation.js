import gql from 'graphql-tag';

export default (trial) => {
    var id = trial.id ? trial.id : `${trial.experimentId}_${Date.now()}`; 
    return gql`mutation {
        addUpdateTrial(
            uid:"${localStorage.getItem('uid')}"
            experimentId:"${trial.experimentId}"
            id:"${id}"
            name:"${trial.name}"
            notes:"${trial.notes}"
            begin:"${trial.begin}"
            end:"${trial.end}"
            devices: ${JSON.stringify(trial.devices).replace(/\"entity\":/g, 'entity:').replace(/\"properties\":/g, 'properties:').replace(/\"key\":/g, 'key:').replace(/\"val\":/g, 'val:').replace(/\"type\":/g, 'type:')},
            assets: ${JSON.stringify(trial.assets).replace(/\"entity\":/g, 'entity:').replace(/\"properties\":/g, 'properties:').replace(/\"key\":/g, 'key:').replace(/\"val\":/g, 'val:').replace(/\"type\":/g, 'type:')},
            trialSet: "${trial.trialSet}"
            properties: ${JSON.stringify(trial.properties).replace(/\"key\":/g, 'key:').replace(/\"val\":/g, 'val:')}
            ){
            id
        }
      }`
}