import React from 'react';
import PropTypes from 'prop-types';
import Graph from '../../../apolloGraphql';
import trialsQuery from '../utils/trialQuery';
import TrialForm from '../TrialForm';
import devicesQuery from '../../DeviceContext/utils/deviceQuery';
import trialMutation from '../TrialForm/utils/trialMutation';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { Query, Subscription } from 'react-apollo';
import { styles } from './styles';

const graphql = new Graph();


class ListOfTrials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trials: props.trials || [],
      timeout: false,
      experimentId: props.experimentId || ""
    }
  }

  componentDidMount() {
  }
  componentDidUpdate() {
    if (this.state.experimentId !== this.props.experimentId) {
      const experimentId = this.props.experimentId
      this.setState(() => ({ experimentId, editTrial: null }))
      this.fetchTrials(experimentId)
    }
  }
  fetchTrials = (experimentId) => {
    graphql.sendQuery(trialsQuery(experimentId))
      .then(data => this.setState(() => ({ trials: data.trials })))
  }

  cloneTrial = (trial) => {
    // let newTrial = JSON.parse(JSON.stringify(trial));
    // newTrial.id = null;
    // let _this = this;

    const newTrial = {
      id: null,
      name: trial.name,
      begin: trial.begin,
      end: trial.end,
      trialSet: trial.trialSet.id,
      properties: trial.properties.map(p => {return({ key: p.key, val: p.val })}),
      devices: trial.devices.map(d => {return({ entity: d.entity.id, properties: d.properties.map(p => {return({ key: p.key, val: p.val })}), type: 'device' })}),
      assets: trial.assets.map(d => {return({ entity: d.entity.id, properties: d.properties.map(p => {return({ key: p.key, val: p.val })}), type: 'asset' })}),
      experimentId: this.state.experimentId
    };

    graphql.sendMutation(trialMutation(newTrial))
        .then(data => {
            window.alert(`saved trial ${data.addUpdateTrial.id}`);
            // _this.props.showAll();
        })
        .catch(err => {
            window.alert(`error: ${err}`);
        });
  }

  render() {
    const classes = this.props;
    return (
      <div>
        {!this.state.editTrial ? <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="left">Trial Name</TableCell>
                <TableCell align="left">Trial Begin</TableCell>
                <TableCell align="left">Trial End</TableCell>
                <TableCell align="left">Trial Devices</TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.trials.map((trial, index) => (
                <TableRow key={index} >
                  <TableCell align="left">{trial.name}</TableCell>
                  <TableCell align="left">{trial.begin}</TableCell>
                  <TableCell align="left">{trial.end}</TableCell>
                  <TableCell align="left">{trial.device && trial.device.name}</TableCell>
                  <TableCell align="left" style={{cursor: 'pointer'}} onClick={() => this.setState({ editTrial: trial })}>Edit</TableCell>
                  <TableCell align="left">
                    <Button variant="contained" className={classes.button} style={{ width: '180px' }}
                      onClick={() => this.cloneTrial(trial)}
                    >
                    Clone
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper> :
          <TrialForm
            {...this.state.editTrial}
            experimentId={this.state.experimentId}
            cancel
            showAll={() => this.setState({ editTrial: null })}
          />            
        }
      </div>
    );
  }

}

ListOfTrials.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListOfTrials);
