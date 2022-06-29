import gql from 'graphql-tag';

const logQuery = (experimentId, logId) => gql`
  {
      log(experimentId:"${experimentId}", logId:"${logId}"){
        title
        key
        created
        updated
        creator
        state
        comment
        labels {
          key
          name
          color
        }
        allLabels {
          key
          name
          color
        }
      }
  }`;

export default logQuery;
