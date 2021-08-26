import gql from "graphql-tag";
import { UPDATE_CONTAINS_ENTITIES_MUTATION } from "../../../../constants/base";
export default (trial, parentEntityKey, entity, action) => {
  return gql`mutation {
        ${UPDATE_CONTAINS_ENTITIES_MUTATION}(
            key:"${trial.key}",
            uid:"${localStorage.getItem("uid")}",
            experimentId:"${trial.experimentId}",
            action: "${action}",
            parentEntityKey: "${parentEntityKey}",
            entity: ${JSON.stringify(entity)
              .replace(/"key":/g, "key:")
              .replace(/"name":/g, "name:")
              .replace(/"state":/g, "state:")
              .replace(/"entitiesTypeKey":/g, "entitiesTypeKey:")
              .replace(/"properties":/g, "properties:")
              .replace(/"key":/g, 'key:')
              .replace(/"val":/g, 'val:')}           
            )
            {
                key
                created
                status
                name
                trialSetKey
                numberOfEntities
                state
                properties {
                  key
                  val
                }
                entities {
                  key
                  entitiesTypeKey
                  containsEntities
                  properties {
                    key
                    val
                  }
                }
                deployedEntities {
                  key
                  entitiesTypeKey
                  containsEntities
                  properties {
                    key
                    val
                  }
                }
              }
      }`;
};
