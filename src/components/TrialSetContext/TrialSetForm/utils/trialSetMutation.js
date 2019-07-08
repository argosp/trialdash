import gql from 'graphql-tag';
import { resultKeyNameFromField } from 'apollo-utilities';

export default (trialSet) => {       
    return gql`
  mutation {
    addUpdateTrialSet(
        uid: "${localStorage.getItem('uid')}",
        experimentId:"${trialSet.experimentId}"
        id: "${trialSet.id}",
        begin: "${trialSet.begin}",
        end: "${trialSet.end}",
        type: "${trialSet.type}",
        properties: ${JSON.stringify(trialSet.properties).replace(/\"key\":/g, 'key:').replace(/\"val\":/g, 'val:')}
        ) {
            id
            begin
            end
            type
        }
    }
    `
}


//[{key: "heat degrees", val: "text"}]