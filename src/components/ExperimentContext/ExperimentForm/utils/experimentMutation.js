import gql from 'graphql-tag';
import uuid from 'uuid/v4';
import { EXPERIMENT_MUTATION } from '../../../../constants/base';

export default (experiment) => {
  const projectId = experiment.projectId ? experiment.projectId : '';

  return gql`mutation {
        ${EXPERIMENT_MUTATION}(
            uid:"${localStorage.getItem('uid')}"
            id:"${projectId}"
            key:"${experiment.key}"
            name:"${experiment.name}"
            description:"${experiment.description}"
            begin:"${experiment.begin}"
            end:"${experiment.end}"
            location:"${experiment.location}"
            numberOfTrials:${experiment.numberOfTrials}
            ${experiment.state ? `state:"${experiment.state}"` : ''}
          ){
            name
            description
            begin
            end
            id
            location
            numberOfTrials
            key
            state
            project {
              id
              name
              description
              status
             }  
        }
      }`;
};
