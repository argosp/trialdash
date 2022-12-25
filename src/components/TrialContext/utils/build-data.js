import gql from "graphql-tag";

export default (trial) => gql`mutation {
        buildExperimentData(
            id: "${trial.id}", 
            uid: "${localStorage.getItem("uid")}",
        )
    }`;
