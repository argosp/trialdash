import gql from 'graphql-tag';

const logsQuery = (experimentId) => gql`
  {
      logs(experimentId:"${experimentId}"){
        title
        key
        created
        state
        labels {
          name
          key
          color
        }
      }
  }`;

export default logsQuery;
