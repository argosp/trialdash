import React from 'react';
import { withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import deviceTypesQuery from '../../DeviceContext/utils/deviceTypeQuery';
import assetsQuery from '../../AssetContext/utils/assetQuery';
import trialMutation from './utils/trialMutation';
import Graph from '../../../apolloGraphql';
import LeafLetMap from '../LeafLetMap';
import Entity from './entity';

import classes from './styles';
// MATERIAL UI DEPENDENCIES

// import { withTheme } from '@material-ui/core/styles';

const graphql = new Graph();

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             width: 250,
//         },
//     },
// };

// const useStyles = makeStyles(theme => ({
//     root: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     formControl: {
//         margin: theme.spacing(1),
//         minWidth: 300,
//         maxWidth: 300,
//     },
//     chips: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     chip: {
//         margin: 2,
//     },
//     noLabel: {
//         marginTop: theme.spacing(3),
//     },
//     button: {
//         margin: theme.spacing(1),
//     },
//     input: {
//         display: 'none',
//     }
// }));

// function getStyles(device, devices, theme) {
//     return {
//         fontWeight:
//             devices.indexOf(device) === -1
//                 ? theme.typography.fontWeightRegular
//                 : theme.typography.fontWeightMedium,
//     };
// }

class TrialForm extends React.Component {
  constructor(props) {
    super(props);
    const properties = props.properties || [];
    if (props.trialSet && props.trialSet.properties) {
      props.trialSet.properties.forEach((p) => {
        const property = properties.find(pr => pr.key === p.key);
        if (property) property.type = p.val;
        else properties.push({ key: p.key, val: '', type: p.val });
      });
    }
    this.state = {
      expanded: null,
      experiments: [],
      experimentId: props.experimentId,
      devicesList: [],
      devices: props.devices || [],
      assetsList: [],
      assets: props.assets || [],
      id: props.id || null,
      name: props.name || '',
      notes: props.notes || '',
      begin: props.begin || null,
      end: props.end || null,
      trialSet: props.trialSet,
      properties,
      errors: {},
    };
  }

  componentDidMount() {
    graphql
      .sendQuery(deviceTypesQuery(this.props.experimentId, 'deviceType'))
      .then((data) => {
        const existingDevices = this.state.devices.map(d => d.name);
        //  "nameFormat": The format of the name. {id} will be replaced by the running
        //  number of the deviceType. (start at 1)
        //  (For example, if Number=3 and namFormat="name_{id:02d}", you will get 3 devices with
        //  names: "name_01", "name_02", "name_03")
        const allDevices = this.buildEntities(data.devices);
        this.setState(() => ({
          allDevices,
          devicesList: allDevices.filter(
            d => existingDevices.indexOf(d.name) === -1,
          ),
        }));
      })
      .then(() => {
        setTimeout(() => {
          this.setState(() => ({ timeout: true }));
        }, 5000);
      });

    graphql
      .sendQuery(assetsQuery(this.props.experimentId, 'asset'))
      .then((data) => {
        const existingAssets = this.state.assets.map(d => d.name);
        const allAssets = this.buildEntities(data.assets);
        this.setState(() => ({
          allAssets,
          assetsList: allAssets.filter(
            d => existingAssets.indexOf(d.name) === -1,
          ),
        }));
      })
      .then(() => {
        setTimeout(() => {
          this.setState(() => ({ timeout: true }));
        }, 5000);
      });
  }

  setObj(key, obj) {
    if (key === 'devices') {
      const existingDevices = obj.map(d => d.name);
      // TODO DEVELOPERS PLEASE FIX IT. STATE MUTATION IS TO BE DONE USING setState
      // eslint-disable-next-line
      this.state.devicesList = this.state.allDevices.filter(
        d => existingDevices.indexOf(d.name) === -1,
      );
    }

    if (key === 'assets') {
      const existingAssets = obj.map(d => d.name);
      // TODO DEVELOPERS PLEASE FIX IT. STATE MUTATION IS TO BE DONE USING setState
      // eslint-disable-next-line
      this.state.assetsList = this.state.allAssets.filter(
        d => existingAssets.indexOf(d.name) === -1,
      );
    }

    this.setState({
      [key]: obj,
    });
  }

  removeEntity = (key, id, name) => {
    const obj = this.state[key].filter(
      e => e.entity.id !== id || e.name !== name,
    );
    this.setObj(key, obj);
  };

  handleChangeMultiple = key => (event) => {
    const properties = event.target.value.properties
      && event.target.value.properties.map(p => ({
        key: p.key,
        val: p.val,
        type: p.type,
      }));
    const obj = this.state[key] || [];
    obj.push({
      entity: event.target.value,
      properties,
      name: event.target.value.name,
    });

    this.setObj(key, obj);
  };

  handleChange = key => (event) => {
    this.setState({
      [key]: event.target.value,
    });
  };

  handleChangeProprty = (index, key, entityType, entityIndex) => (event) => {
    // TODO DEVELOPERS PLEASE FIX IT. STATE MUTATION IS TO BE DONE USING setState
    // eslint-disable-next-line
    if (entityType) this.state[entityType][entityIndex].properties[index][key] =        event.target.value;
    // TODO DEVELOPERS PLEASE FIX IT. STATE MUTATION IS TO BE DONE USING setState
    // eslint-disable-next-line
    else this.state.properties[index][key] = event.target.value;
    this.setState({});
  };

  submitTrial = () => {
    this.setState({ errors: {} });
    const errors = {};
    let e = false;
    if (!this.state.trialSet || !this.state.trialSet.id) {
      errors.trialSet = true;
      e = true;
    }
    if (e) {
      this.setState({ errors });
      return;
    }
    const newTrial = {
      id: this.state.id,
      name: this.state.name,
      notes: this.state.notes,
      begin: this.state.begin,
      end: this.state.end,
      trialSet: this.state.trialSet.id,
      properties: this.state.properties.map(p => ({ key: p.key, val: p.val })),
      devices: this.state.devices.map(d => ({
        entity: d.entity.id,
        name: d.name,
        properties: d.properties.map(p => ({ key: p.key, val: p.val })),
        type: 'device',
      })),
      assets: this.state.assets.map(d => ({
        entity: d.entity.id,
        name: d.name,
        properties: d.properties
          ? d.properties.map(p => ({ key: p.key, val: p.val }))
          : [],
        type: 'asset',
      })),
      experimentId: this.state.experimentId,
    };

    const self = this;

    graphql
      .sendMutation(trialMutation(newTrial))
      .then((data) => {
        window.alert(`saved trial ${data.addUpdateTrial.id}`);
        self.props.showAll();
      })
      .catch((err) => {
        window.alert(`error: ${err}`);
      });
  };

  buildEntities = (entities) => {
    const list = [];
    let a;
    entities.forEach((e) => {
      for (let i = 0; i < parseInt(e.number, 10); i += 1) {
        a = JSON.parse(JSON.stringify(e));
        a.name = e.name.replace(/{id:(\d*)d}/, (match, number) => ('0'.repeat(parseInt(number, 10)) + (i + 1)).slice(-parseInt(number, 10)));
        list.push(a);
      }
    });
    return list;
  };

  render() {
    return (
      <form
        style={classes.container}
        noValidate
        autoComplete="off"
      >
        <div>
          <div>
            {this.state.id
              ? `Edit trial of trialSet ${this.state.trialSet.name}`
              : `Add trial to trialSet ${this.state.trialSet.name}`}
          </div>
          <TextField
            style={{ width: '300px', marginTop: '30px' }}
            id="name"
            label="Name"
            className={classes.textField}
            value={this.state.name}
            onChange={this.handleChange('name')}
          />
          <br />
          <TextField
            style={{ width: '300px', marginTop: '30px' }}
            id="begin"
            label="Begin"
            type="date"
            className={classes.textField}
            value={this.state.begin}
            onChange={this.handleChange('begin')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br />
          <TextField
            style={{ width: '300px', marginTop: '30px' }}
            id="end"
            label="End"
            type="date"
            className={classes.textField}
            value={this.state.end}
            onChange={this.handleChange('end')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br />
          <TextField
            style={{ width: '300px', marginTop: '30px' }}
            id="trialSet"
            label="Tial Set"
            type="text"
            readOnly
            className={classes.textField}
            value={this.state.trialSet.name}
          />
          <br />
          <TextField
            style={{ width: '300px', marginTop: '30px' }}
            id="notes"
            label="Notes"
            multiline
            rows={5}
            className={classes.textField}
            value={this.state.notes}
            onChange={this.handleChange('notes')}
          />
          <br />
          <h3>properties:</h3>
          {this.state.properties.map((p, i) => {
            if (p.type === 'location') {
              return (
                <LeafLetMap
                  onChange={this.handleChangeProprty(i, 'val')}
                  location={p.val && p.val !== '' ? p.val.split(',') : [0, 0]}
                />
              );
            }
            return (
              // TODO Add id field into p
              <div key={p.id} style={{ display: 'flex' }}>
                <TextField
                  style={{ width: '300px' }}
                  type={p.type}
                  label={p.key}
                  className={classes.textField}
                  value={p.val}
                  onChange={this.handleChangeProprty(i, 'val')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <br />
              </div>
            );
          })}
          <Entity
            entities={this.state.devices}
            entityName="devices"
            removeEntity={this.removeEntity}
            handleChangeMultiple={this.handleChangeMultiple}
            handleChangeProprty={this.handleChangeProprty}
            entitiesList={this.state.devicesList}
          />
          <Entity
            entities={this.state.assets}
            entityName="assets"
            removeEntity={this.removeEntity}
            handleChangeMultiple={this.handleChangeMultiple}
            handleChangeProprty={this.handleChangeProprty}
            entitiesList={this.state.assetsList}
          />
          <FormControl
            className={classes.formControl}
            style={{ width: '300px', marginTop: '30px' }}
          >
            <div
              style={{
                marginTop: '50px',
                textAlign: 'center',
                display: 'flex',
              }}
            >
              <Button
                variant="contained"
                className={classes.button}
                style={{ width: '180px' }}
                onClick={this.submitTrial}
              >
                Submit
              </Button>
              {this.props.cancel && (
                <Button
                  variant="contained"
                  className={classes.button}
                  style={{ width: '180px' }}
                  onClick={this.props.showAll}
                >
                  Cancel
                </Button>
              )}
            </div>
          </FormControl>
        </div>
      </form>
    );
  }
}

export default withTheme(TrialForm);
