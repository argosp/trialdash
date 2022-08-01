import gql from 'graphql-tag';

const logQuery = (experimentId, logId) => gql`
  {
      log(experimentId:"${experimentId}", logId:"${logId}"){
        title
        key
        created
        updated
        startDate
        creator
        state
        comment
        labels {
          key
          name
          color
        }
      }
  }`;

export default logQuery;
