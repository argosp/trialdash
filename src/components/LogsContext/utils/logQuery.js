import gql from 'graphql-tag';

const logQuery = (experimentId, logId) => gql`
  {
      log(experimentId:"${experimentId}", logId:"${logId}"){
        title
        key
        created
        updated
        creator
        comment
        allLabels {
          key
          name
        }
      }
  }`;

export default logQuery;
