import trialMutation from '../TrialForm/utils/trialMutation';
import { updateCache } from '../../../apolloGraphql';
import { TRIALS, TRIAL_MUTATION } from '../../../constants/base';
import trialsQuery from '../utils/trialQuery';
import entitiesTypesQuery from '../../EntityContext/utils/entityTypeQuery';

function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var commaRegex = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g

  var quotesRegex = /^"(.*)"$/g

  var headers = lines[0].split(commaRegex).map(h => h.replace(quotesRegex, "$1"));

  for(var i=1;i<lines.length;i++){

      var obj = {};
      var currentline=lines[i].split(commaRegex);


      for(var j=0;j<headers.length;j++){

          obj[headers[j]] = currentline[j] && currentline[j].replace(quotesRegex, "$1");
      }

      result.push(obj);

  }
  console.log('44444444444444', result)
  return result;
  //return JSON.stringify(result);
}

function csvFileToArray(data) {
  const delimiter = ','
  const titles = data.slice(0, data.indexOf('\n')).split(delimiter);
  return data
    .slice(data.indexOf('\n') + 1)
    .split('\n')
    .map(v => {
      const values = v.split(delimiter);
      console.log(values, titles)
      return titles.reduce(
        (obj, title, index) => (((obj[title] = values[index] && values[index].replace(/(['"])/g, "")), obj)),
        {}
      );
    });
}

async function submitTrial(trial, client, match) {
  return await client.mutate({
    mutation: trialMutation(trial),
    update: (cache, mutationResult) => {
      if (mutationResult && mutationResult.data.addUpdateTrial.error) {
        return alert(mutationResult.data.addUpdateTrial.error)
      }
      updateCache(
        cache,
        mutationResult,
        trialsQuery(match.params.id, match.params.trialSetKey),
        TRIALS,
        TRIAL_MUTATION,
        false,
        'trialSetKey',
      );
    },
  });
}

function uploadTrial(e, trialSet, client, match) {
  return new Promise((resolve) => {
    const file = e.target.files[0]
    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const text = event.target.result;
      const json = csvFileToArray(text);
      const trial = json[0]
      const properties = trialSet.properties.map(prop => {
        const propInTrial = Object.keys(trial).find(p => p === prop.label)
        return { key: prop.key, val: trial[propInTrial] }
      })
      const updatedTrial = {
        ...trial,
        properties,
        experimentId: match.params.id,
        action: "update"
      }
      await submitTrial(updatedTrial, client, match)
      return resolve(true)
    };
    fileReader.readAsText(file);
  })

}
async function fetchEntityTypesData(client, match) {
  const { data } = await client.query({
    query: entitiesTypesQuery(match.params.id)
  });
  return data.entitiesTypes.reduce((prev, curr) => ({...prev,[curr.key]: curr}), {})

}

function uploadEntities(e, trial, client, match) {
  return new Promise((resolve) => {
    const file = e.target.files[0]
    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const text = event.target.result;
      const json = csvJSON(text);
      const entityTypes = await fetchEntityTypesData(client, match)
      const entityProps = json.reduce((prev, curr) => ({...prev, [curr.key]: curr}), {})
      const entities = trial.entities.map(entity => {
        const properties = entity.properties.map(prop => {
          const propLabel = entityTypes[entity.entitiesTypeKey].properties.find(p => p.key === prop.key)
          const propInEntity = Object.keys(entityProps[entity.key]).find(p => p === propLabel.label)
          return { key: prop.key, val: entityProps[entity.key][propInEntity].replace(/'/g,"\"") }
        })
        return { ...entity, properties }
      })
      const updatedTrial = {
        ...trial,
        experimentId: match.params.id,
        entities,
        changedEntities: entities,
        action: "update"
      }
      await submitTrial(updatedTrial, client, match)
      return resolve(true)
    };
    fileReader.readAsText(file);
  })
}
export {
  uploadTrial,
  uploadEntities
}