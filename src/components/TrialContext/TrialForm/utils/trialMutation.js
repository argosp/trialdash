import gql from 'graphql-tag';

export default (trial) => {   
    const devices = trial.devices.map(d => `"${d}"`).join(',');
    return gql`mutation {
        addUpdateTrial(
            uid:"${localStorage.getItem('uid')}"
            experimentId:"${trial.experimentId}"
            id:"${trial.id}"
            name:"${trial.name}"
            begin:"${trial.begin}"
            end:"${trial.end}"
            devices: [${devices}]
          ){
            id
        }
      }`
}