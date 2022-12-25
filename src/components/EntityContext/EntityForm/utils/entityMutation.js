import gql from "graphql-tag";
import { ENTITY_MUTATION } from "../../../../constants/base";

export default (device) => {
  const key = device.key ? device.key : `${device.experimentId}_${Date.now()}`;

  return gql`mutation {
        ${ENTITY_MUTATION}(
            key: "${key}",
            uid:"${localStorage.getItem("uid")}"
            experimentId:"${device.experimentId}"
            name:"${device.name}"
            entitiesTypeKey: "${device.entitiesTypeKey}"
            ${device.state ? `state:"${device.state}"` : ""}
            properties: ${JSON.stringify(device.properties)
              .replace(/"key":/g, "key:")
              .replace(/"val":/g, "val:")}
            ){
            key
            name
            entitiesTypeKey
            state
            error
            properties {
              key
              val
            }
        }
      }`;
};
