import gql from 'graphql-tag';

function cleanEntity(entity) {
    return JSON.stringify(entity).replace(/\"entity\":/g, 'entity:').replace(/\"name\":/g, 'name:').replace(/\"properties\":/g, 'properties:').replace(/\"key\":/g, 'key:').replace(/\"val\":/g, 'val:').replace(/\"type\":/g, 'type:');
}

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
            devices: ${cleanEntity(trial.devices)},
            assets: ${cleanEntity(trial.assets)},
            trialSet: "${trial.trialSet}"
            properties: ${JSON.stringify(trial.properties).replace(/\"key\":/g, 'key:').replace(/\"val\":/g, 'val:')}
            ){
            id
        }
      }`
}