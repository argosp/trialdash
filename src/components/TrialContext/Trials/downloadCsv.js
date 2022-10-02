import trialsQuery from '../utils/trialQuery';
import moment from 'moment';
import { TRIALS } from '../../../constants/base';

function getProperties(trial, trialSet) {
  const _properties = (trialSet && trialSet.properties) || []
  return _properties.reduce((prev, property)=> {
    const propInTrial = trial.properties.find(p => p.key === property.key)
    return {
      ...prev,
      [property.label]: (propInTrial && propInTrial.val) || ''
    }
  }, {})

}

function fetchCsvData(client, match, trialSet, displayCloneData) {
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

  let value;
  return [
    // get csv headers
    Object.keys(fixedTrials[0]),
    // get csv data
    ...fixedTrials.map(item =>
      Object.keys(item).map(key => {

        value = item[key];

        if (typeof value == 'object' && value) {
          // convert object to string
          value = JSON.stringify(value).replace(/"/g, "'");
        }

        if (typeof value == 'string') {
          // replace quotation marks, with commas
          value = value.replace(/"/g, "'");
          // if find a comma in the value, set quotation marks around the value
          value = `"${value}"`;
        }

        return value;
      })
    )
  ].join("\n");
}

export default async function downloadCsv(client, match, trialSet, displayCloneData) {

  const csvString = await fetchCsvData(client, match, trialSet, displayCloneData);
  const csvData = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const csvUrl = URL.createObjectURL(csvData);
  const a = document.createElement('a');
  a.href = csvUrl;
  a.download = `trials.csv`;
  a.click();
  URL.revokeObjectURL(csvUrl);
}
