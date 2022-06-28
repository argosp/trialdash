import gql from 'graphql-tag';

const logsQuery = (experimentId) => gql`
  {
      logs(experimentId:"${experimentId}"){
        title
        key
        created
        labels {
          name
        }
        allLabels {
          name
        }
      }
  }`;

export default logsQuery;
