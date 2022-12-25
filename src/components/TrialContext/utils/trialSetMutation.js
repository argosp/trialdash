import gql from "graphql-tag";
import { TRIAL_SET_MUTATION } from "../../../constants/base";

export default (trialSet) => {
  const key = trialSet.key
    ? trialSet.key
    : `${trialSet.experimentId}_${Date.now()}`;

  return gql`
  mutation {
    ${TRIAL_SET_MUTATION}(
        uid: "${localStorage.getItem("uid")}",
        experimentId:"${trialSet.experimentId}"
        key: "${key}",
        name: "${trialSet.name}",
        description: "${trialSet.description}",
        numberOfTrials: ${trialSet.numberOfTrials},
        cloneTrailKey: "${trialSet.cloneTrailKey}",
        ${trialSet.state ? `state:"${trialSet.state}"` : ""}
        properties: ${JSON.stringify(trialSet.properties)
          .replace(/"key":/g, "key:")
          .replace(/"type":/g, "type:")
          .replace(/"label":/g, "label:")
          .replace(/"description":/g, "description:")
          .replace(/"required":/g, "required:")
          .replace(/"template":/g, "template:")
          .replace(/"multipleValues":/g, "multipleValues:")
          .replace(/"value":/g, "value:")
          .replace(/"defaultValue":/g, "defaultValue:")
          .replace(/"inheritable":/g, "inheritable:")
          .replace(/"static":/g, "static:")}
        ) {
            key
            name
            description
            numberOfTrials
            state
            properties {
              key
              type
              label
              description
              required
              template
              multipleValues
              value
              defaultValue
              inheritable
            }
        }
    }
    `;
};
