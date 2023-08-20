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
  let value
  return array.map(item =>
    Object.keys(item).map(key => {
      value = item[key];
      if (typeof value == 'string') {
        value = value.replace(/"/g, "'");
        value = `"${value}"`;
      }
      return value
    })
  )
}

function makeCsvData(array) {
  return [
    // get csv headers
    Object.keys(array[0]),
    // get csv data
    ...getCsvData(array)
  ].join("\n");
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
    status: t.status
  }))

  return makeCsvData(fixedTrials);
}

function fetchTrialData(trial, trials, trialSet, displayCloneData) {
  const fixedTrial = {
    name: trial.name,
    key: trial.key,
    cloneFrom: trial.cloneFrom ? displayCloneData(trial, trials) : '',
    numberOfEntities: trial.numberOfEntities,
    trialSetKey: trialSet.key,
    ...getProperties(trial, trialSet),
    created: moment(trial.created).format('D/M/YYYY'),
    status: trial.status
  }

  return makeCsvData([fixedTrial]);
}

function fetchEntitiesData(trial) {

  const entities = trial.fullDetailedEntities.map(e => ({
    name: e.name,
    key: e.key,
    entitiesTypeName: e.entitiesTypeName,
    entitiesTypekey: e.entitiesTypeKey,
    ...getEntityProperties(e)
  }))

  return makeCsvData(entities);
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
  const { data } = await args.client.query({
    query: fullTrialQuery(args.match.params.id, args.trial.key)
  });
  const { trial } = data
  const csvStringTrial = await fetchTrialData(trial, args.trials, args.trialSet, args.displayCloneData);
  download(csvStringTrial, `trial_${trial.name}`)
  if (trial.fullDetailedEntities && trial.fullDetailedEntities.length) {
    const csvStringEntities = await fetchEntitiesData(trial, args.trials, args.trialSet, args.displayCloneData);
    download(csvStringEntities, `trial_${trial.name}_entities`)
  }

}

export {
  downloadTrial,
  downloadTrials
}
