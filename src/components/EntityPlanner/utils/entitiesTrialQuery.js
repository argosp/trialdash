import gql from "graphql-tag";

const devicesTrialQuery = (experimentId, entitiesTypeKey, trialKey) => gql`
  {
    entities(experimentId:"${experimentId}", entitiesTypeKey:"${entitiesTypeKey}"${
  trialKey ? `, trialKey:"${trialKey}"` : ""
}){
      key
      name
      entitiesTypeKey
      properties{
        key
        val
      }
    }
  }`;

export default devicesTrialQuery;
