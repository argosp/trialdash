import gql from 'graphql-tag';
import uuid from 'uuid/v4';
import { EXPERIMENT_MUTATION } from '../../../../constants/base';

export default (experiment) => {
  const projectId = experiment.projectId ? experiment.projectId : '';
  if (!experiment.key || experiment.key === 'null') experiment.key = uuid();
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
            ${experiment.status ? `status:"${experiment.status}"` : ''}
            ${experiment.state ? `state:"${experiment.state}"` : ''}
            ${experiment.maps ? `maps: ${JSON.stringify(experiment.maps)
              .replace(/"imageUrl":/g,'imageUrl:')
              .replace(/"imageName":/g, 'imageName:')
              .replace(/"lower":/g, 'lower:')
              .replace(/"upper":/g, 'upper:')
              .replace(/"right":/g, 'right:')
              .replace(/"left":/g, 'left:')
              .replace(/"width":/g, 'width:')
              .replace(/"height":/g, 'height:')
              .replace(/"embedded":/g, 'embedded:')}` : ''}
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
            status
            maps {
              imageUrl
              imageName
              lower
              right
              upper
              left
              embedded
            }
            project {
              id
              name
              description
             }  
        }
      }`;
};
