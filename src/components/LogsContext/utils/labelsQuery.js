import gql from "graphql-tag";

const labelsQuery = (experimentId) => gql`
  {
      labels(experimentId:"${experimentId}"){
        name
        key
        color
      }
  }`;

export default labelsQuery;
