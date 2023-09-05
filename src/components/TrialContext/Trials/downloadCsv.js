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

function makeGeoJsonData(entities) {
  const located = entities.filter(e => e.Latitude && e.Longitude);
  const features = located.map(e => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [e.Latitude, e.Longitude]
      },
      properties: e.properties
    }
  });
  return JSON.stringify({
    type: 'FeatureCollection',
    features
  }, null, 2);
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
    const { name, key, entitiesTypeName, entitiesTypekey, properties } = e;
    let ret = {};
    if (withKeys) {
      ret = { name, key, entitiesTypeName, entitiesTypekey };
    } else {
      ret = { name, entitiesTypeName };
    }
    for (let { label, val, type } of properties) {
      if (type === 'location') {
        try {
          const json = JSON.parse(val);
          if (json.name && json.coordinates && json.coordinates.length === 2) {
            ret['MapName'] = json.name;
            ret['Latitude'] = json.coordinates[0];
            ret['Longitude'] = json.coordinates[1];
          } else {
            ret[label] = val;
          }
        } catch (err) {
          console.log(err);
          ret[label] = val;
        }
      } else {
        ret[label] = val;
      }
    }
    return ret;
  });
  return entities;
}


function download(csvString, fileName) {
  const csvData = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const csvUrl = URL.createObjectURL(csvData);
  const a = document.createElement('a');
  a.href = csvUrl;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(csvUrl);
}

async function downloadTrials(client, match, trialSet, displayCloneData) {
  const csvString = await fetchTrialsData(client, match, trialSet, displayCloneData);
  download(csvString, 'trials.csv')
}
async function downloadTrial(args) {
  const { data } = await args.client.query({
    query: fullTrialQuery(args.match.params.id, args.trial.key)
  });
  const { trial } = data
  const csvStringTrial = await fetchTrialData(trial, args.trials, args.trialSet, args.displayCloneData);
  download(csvStringTrial, `trial_${trial.name}.csv`)
  if (trial.fullDetailedEntities && trial.fullDetailedEntities.length) {
    const entities = await fetchEntitiesData(trial, args.trials, args.trialSet, args.displayCloneData);
    const csvStringEntities = makeCsvData(entities);
    download(csvStringEntities, `trial_${trial.name}_entities.csv`)
  }

}

async function downloadEntities({ client, match, trial, fileFormat = "csv" }) {
  const { data } = await client.query({
    query: fullTrialQuery(match.params.id, trial.key)
  });
  if (data.trial && data.trial.fullDetailedEntities && data.trial.fullDetailedEntities.length) {
    const entities = await fetchEntitiesData(data.trial, false);
    if (fileFormat.toLowerCase() === "csv") {
      const str = makeCsvData(entities);
      download(str, `trial_${data.trial.name}_entities.csv`)
    } else if (fileFormat.toLowerCase() === "geojson") {
      const str = makeGeoJsonData(entities);
      download(str, `trial_${data.trial.name}_entities.geojson`)
    }
  }
}

export {
  downloadTrial,
  downloadTrials,
  downloadEntities
}
