import gql from 'graphql-tag';

const addUpdateLog = (experimentId, log) => {
  const logData = {
    key: log.key,
    title: log.title,
    comment: log.comment,
    labels: log.labels && log.labels.map(q => q.key || q),
    state: log.state
  }

  return gql`
  mutation {
    addUpdateLog(
      experimentId:"${experimentId}",
      uid: "${localStorage.getItem('uid')}",
      logData: ${JSON.stringify(logData)
      .replace(/"title":/g, 'title:')
      .replace(/"key":/g, 'key:')
      .replace(/"comment":/g, 'comment:')
      .replace(/"labels":/g, 'labels:')
      .replace(/"state":/g, 'state:')
    }
    ) {
        title     
        comment  
      }
      }`
};


export default addUpdateLog;
