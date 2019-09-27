import gql from 'graphql-tag';

export default (trialSet) => {
  const id = trialSet.id ? trialSet.id : `${trialSet.experimentId}_${Date.now()}`;
  return gql`
  mutation {
    addUpdateTrialSet(
        uid: "${localStorage.getItem('uid')}",
        experimentId:"${trialSet.experimentId}"
        id: "${id}",
        name: "${trialSet.name}",
        description: "${trialSet.description}",
        properties: ${JSON.stringify(trialSet.properties).replace(/"key":/g, 'key:').replace(/"val":/g, 'val:')}
        ) {
            name 
        }
    }
    `;
};


// [{key: "heat degrees", val: "text"}]
