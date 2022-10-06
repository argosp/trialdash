import trialsQuery from '../utils/trialQuery';
import fullTrialQuery from '../utils/fullTrialQuery';
import moment from 'moment';
import { TRIALS } from '../../../constants/base';

function getProperties(trial, trialSet) {
  const _properties = (trialSet && trialSet.properties) || []
  return _properties.reduce((prev, property) => {
    const propInTrial = trial.properties.find(p => p.key === property.key)
    return {
      ...prev,
      [property.label]: (propInTrial && propInTrial.val) || ''
    }
  }, {})

}

function getEntityProperties(entity) {
  return entity.properties.reduce((prev, prop) => {
    return {
      ...prev,
      [prop.label]: prop.val
    }
  }, {})
}

function getCsvData(array) {
  const replacer = (key, value) => value === null ? '' : value
  return array.map(item =>
    Object.keys(item).map(key => JSON.stringify(item[key], replacer))
  )
}

function fetchTrialsData(client, match, trialSet, displayCloneData) {
  const trials = client.readQuery({
    query: trialsQuery(match.params.id, match.params.trialSetKey)
  })[TRIALS];

  const fixedTrials = trials.map(t => ({
    name: t.name,
    cloneFrom: t.cloneFrom ? displayCloneData(t, trials) : '',
    numberOfEntities: t.numberOfEntities,
    ...getProperties(t, trialSet),
    created: moment(t.created).format('D/M/YYYY'),
    state: t.status
  }))

  return [
    // get csv headers
    Object.keys(fixedTrials[0]),
    // get csv data
    ...getCsvData(fixedTrials)
  ].join("\r\n");
}

function fetchTrialData(trial, trials, trialSet, displayCloneData) {
  const fixedTrial = {
    name: trial.name,
    cloneFrom: trial.cloneFrom ? displayCloneData(trial, trials) : '',
    numberOfEntities: trial.numberOfEntities,
    ...getProperties(trial, trialSet),
    created: moment(trial.created).format('D/M/YYYY'),
    state: trial.status
  }

  return [
    // get csv headers
    Object.keys(fixedTrial),
    // get csv data
    ...getCsvData([fixedTrial])
  ].join("\n");
}

function fetchEntitiesData(trial) {

  const entities = trial.fullDetailedEntities.map(e => ({
    entitiesTypeName: e.entitiesTypeName,
    entitiesTypekey: e.entitiesTypeKey,
    name: e.name,
    ...getEntityProperties(e)
  }))

  return [
    // get csv headers
    Object.keys(entities[0]),
    // get csv data
    ...getCsvData(entities)
  ].join("\n");
}


function download(csvString, fileName) {
  const csvData = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const csvUrl = URL.createObjectURL(csvData);
  const a = document.createElement('a');
  a.href = csvUrl;
  a.download = `${fileName}.csv`;
  a.click();
  URL.revokeObjectURL(csvUrl);
}

async function downloadTrials(client, match, trialSet, displayCloneData) {
  const csvString = await fetchTrialsData(client, match, trialSet, displayCloneData);
  download(csvString, 'trials')
}
async function downloadTrial(args) {
  const {data} = await args.client.query({
    query: fullTrialQuery(args.match.params.id, args.trial.key)
  });
  const {trial} = data
  const csvStringTrial = await fetchTrialData(trial, args.trials, args.trialSet, args.displayCloneData);
  download(csvStringTrial, `trial_${trial.name}`)
  const csvStringEntities = await fetchEntitiesData(trial, args.trials, args.trialSet, args.displayCloneData);
  download(csvStringEntities, `trial_${trial.name}_entities`)
}

export {
  downloadTrial,
  downloadTrials
}
