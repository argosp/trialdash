import gql from 'graphql-tag';
import uuid from 'uuid/v4';

export default (experiment) => {
  const id = experiment.id ? experiment.id : uuid();

  return gql`mutation {
        addUpdateExperiment(
            uid:"${localStorage.getItem('uid')}"
            id:"${id}"
            name:"${experiment.name}"
            description:"${experiment.description}"
            begin:"${experiment.begin}"
            end:"${experiment.end}"
            location:"${experiment.location}"
            numberOfTrials:${experiment.numberOfTrials}
          ){
            id
        }
      }`;
};
