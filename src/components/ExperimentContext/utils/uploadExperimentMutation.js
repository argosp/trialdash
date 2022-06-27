import gql from 'graphql-tag';
import uuid from 'uuid/v4';

const uploadExperiment = ({ experiment, entities, entityTypes, trialSets, trials, logs }) => {

  let entityTypesStr = '';
  entityTypes.forEach(e => {
    entityTypesStr += `{
      key: "${e.key}",
      name: "${e.name}",
      numberOfEntities: ${e.numberOfEntities},
      ${e.state ? `state:"${e.state}"` : ''}
      properties: ${JSON.stringify(e.properties)
        .replace(/"key":/g, 'key:')
        .replace(/"type":/g, 'type:')
        .replace(/"label":/g, 'label:')
        .replace(/"description":/g, 'description:')
        .replace(/"prefix":/g, 'prefix:')
        .replace(/"suffix":/g, 'suffix:')
        .replace(/"required":/g, 'required:')
        .replace(/"template":/g, 'template:')
        .replace(/"multipleValues":/g, 'multipleValues:')
        .replace(/"trialField":/g, 'trialField:')
        .replace(/"value":/g, 'value:')
        .replace(/"defaultValue":/g, 'defaultValue:')
        .replace(/"defaultProperty":/g, 'defaultProperty:')
        .replace(/"inheritable":/g, 'inheritable:')
      }
    }`
  });

  let entitiesStr = '';
  entities.forEach(e => {
    entitiesStr += `{
      key: "${e.key}",
      name: "${e.name}",
      entitiesTypeKey: "${e.entitiesTypeKey}",
      ${e.state ? `state:"${e.state}"` : ''}
      properties: ${JSON.stringify(e.properties)
        .replace(/"key":/g, 'key:')
        .replace(/"val":/g, 'val:')
      }
    }`
  });

  let trialSetsStr = '';
  trialSets.forEach(e => {
    trialSetsStr += `{
      key: "${e.key}",
      name: "${e.name}",
      description: "${e.description}",
      numberOfTrials: ${e.numberOfTrials},
      ${e.state ? `state:"${e.state}"` : ''}
      properties: ${JSON.stringify(e.properties)
        .replace(/"key":/g, 'key:')
        .replace(/"type":/g, 'type:')
        .replace(/"label":/g, 'label:')
        .replace(/"description":/g, 'description:')
        .replace(/"required":/g, 'required:')
        .replace(/"template":/g, 'template:')
        .replace(/"multipleValues":/g, 'multipleValues:')
        .replace(/"value":/g, 'value:')
        .replace(/"defaultValue":/g, 'defaultValue:')
        .replace(/"inheritable":/g, 'inheritable:')
      }
    }`
  });

  let trialsStr = '';
  trials.forEach(e => {
    trialsStr += `{
      key: "${e.key}",
      name: "${e.name}",
      status:"${e.status}",
      trialSetKey: "${e.trialSetKey}",
      numberOfEntities:${e.numberOfEntities},
      ${e.state ? `state:"${e.state}"` : ''},
      ${e.changedEntities ? `changedEntities: ${JSON.stringify(e.changedEntities)
        .replace(/"key":/g, 'key:')
        .replace(/"val":/g, 'val:')
        .replace(/"type":/g, 'type:')
        .replace(/"entitiesTypeKey":/g, 'entitiesTypeKey:')
        .replace(/"properties":/g, 'properties:')
        .replace(/"containsEntities":/g, 'containsEntities:')}` : ''},
      properties: ${JSON.stringify(e.properties)
        .replace(/"key":/g, 'key:')
        .replace(/"val":/g, 'val:')},
      entities: ${JSON.stringify(e.entities)
        .replace(/"key":/g, 'key:')
        .replace(/"val":/g, 'val:')
        .replace(/"type":/g, 'type:')
        .replace(/"entitiesTypeKey":/g, 'entitiesTypeKey:')
        .replace(/"properties":/g, 'properties:')
        .replace(/"containsEntities":/g, 'containsEntities:')},
      deployedEntities: ${JSON.stringify(e.deployedEntities)
        .replace(/"key":/g, 'key:')
        .replace(/"val":/g, 'val:')
        .replace(/"type":/g, 'type:')
        .replace(/"entitiesTypeKey":/g, 'entitiesTypeKey:')
        .replace(/"properties":/g, 'properties:')
        .replace(/"containsEntities":/g, 'containsEntities:')}
    }`
  });

  let logsStr = '';
  logs.forEach(e => {
    logsStr += `${JSON.stringify({ title: e.title, key: e.key, comment: e.comment })
      .replace(/"title":/g, 'title:')
      .replace(/"key":/g, 'key:')
      .replace(/"comment":/g, 'comment:')
      }`
  });

  return gql`
    mutation{
        uploadExperiment(
            experiment: {
                key: "${uuid()}",
                name: "${experiment.name}",
                description: "${experiment.description}",
                begin: "${experiment.begin}",
                end: "${experiment.end}",
                location: "${experiment.location}",
                numberOfTrials: ${experiment.numberOfTrials},
                ${experiment.status ? `status:"${experiment.status}"` : ''},
                ${experiment.state ? `state:"${experiment.state}"` : ''},
                ${experiment.maps ? `maps: ${JSON.stringify(experiment.maps)
      .replace(/"imageUrl":/g, 'imageUrl:')
      .replace(/"imageName":/g, 'imageName:')
      .replace(/"lower":/g, 'lower:')
      .replace(/"upper":/g, 'upper:')
      .replace(/"right":/g, 'right:')
      .replace(/"left":/g, 'left:')
      .replace(/"width":/g, 'width:')
      .replace(/"height":/g, 'height:')
      .replace(/"embedded":/g, 'embedded:')}` : ''}
            },
            entityTypes: [${entityTypesStr}],
            entities: [${entitiesStr}],
            trialSets: [${trialSetsStr}],
            trials: [${trialsStr}],
            logs: [${logsStr}],
            uid: "${localStorage.getItem('uid')}"){
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
    }`};

export default uploadExperiment;
