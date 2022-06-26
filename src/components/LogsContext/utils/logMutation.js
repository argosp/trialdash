import gql from 'graphql-tag';

const addUpdateLog = (experimentId, log) => {
  const logData = {
    key: log.key,
    title: log.title,
    comment: log.comment
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
    }
    ) {
        title     
        comment  
      }
      }`
};


export default addUpdateLog;
