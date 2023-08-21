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
  return Object.fromEntries(entity.properties.map(({ val, label }) => [label, val]));
}

function makeCsvData(array) {
  const headers = Object.keys(array[0]);
  const data = array.map(item => {
    return Object.values(item).map(value => {
      if (typeof value == 'string') {
        return `"${value.replace(/"/g, "'")}"`;
      } else if (value === undefined || value === null) {
        return '';
      }
      return value;
    });
  });
  const csv = [headers, ...data];
  return csv.join("\n");
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

function fetchEntitiesData(trial, withKeys = false) {
  const entities = trial.fullDetailedEntities.map(e => {
    const props = getEntityProperties(e);
    const { name, key, entitiesTypeName, entitiesTypekey } = e;
    if (withKeys) {
      return { name, key, entitiesTypeName, entitiesTypekey, ...props };
    } else {
      return { name, entitiesTypeName, ...props };
    }
  });
  return entities;
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
    const entities = await fetchEntitiesData(trial, args.trials, args.trialSet, args.displayCloneData);
    const csvStringEntities = makeCsvData(entities);
    download(csvStringEntities, `trial_${trial.name}_entities`)
  }

}

async function downloadEntities({ client, match, trial, withKeys = false }) {
  const { data } = await client.query({
    query: fullTrialQuery(match.params.id, trial.key)
  });
  if (data.trial && data.trial.fullDetailedEntities && data.trial.fullDetailedEntities.length) {
    const entities = await fetchEntitiesData(data.trial, withKeys);
    const csvStringEntities = makeCsvData(entities);
    download(csvStringEntities, `trial_${data.trial.name}_entities`)
  }

}

export {
  downloadTrial,
  downloadTrials,
  downloadEntities
}
