import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import trialMutation from '../TrialForm/utils/trialMutation';
import TrialForm from '../TrialForm';
import buildData from '../utils/build-data';
import trialsQuery from '../utils/trialQuery';
import Graph from '../../../apolloGraphql';
import { styles } from './styles';
import ContentTable from '../../ContentTable';

const graphql = new Graph();

class ListOfTrials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trials: props.trials || [],
      experimentId: props.experimentId || '',
    };
  }

  componentDidUpdate() {
    if (this.state.experimentId !== this.props.experimentId) {
      const { experimentId } = this.props;
      this.setState(() => ({ experimentId, editTrial: null }));
      this.fetchTrials(experimentId);
    }
  }

  fetchTrials = (experimentId) => {
    graphql
      .sendQuery(trialsQuery(experimentId))
      .then(data => this.setState(() => ({ trials: data.trials })));
  };

  cloneTrial = (trial) => {
    // let newTrial = JSON.parse(JSON.stringify(trial));
    // newTrial.id = null;
    // let _this = this;

    const newTrial = {
      id: null,
      name: trial.name,
      notes: trial.notes,
      begin: trial.begin,
      end: trial.end,
      trialSet: trial.trialSet.id,
      properties: trial.properties
        ? trial.properties.map(p => ({ key: p.key, val: p.val }))
        : [],
      devices: trial.devices
        ? trial.devices.map(d => ({
          entity: d.entity.id,
          properties: d.properties
            ? d.properties.map(p => ({ key: p.key, val: p.val }))
            : [],
          type: 'device',
        }))
        : [],
      assets: trial.assets
        ? trial.assets.map(d => ({
          entity: d.entity.id,
          properties: d.properties
            ? d.properties.map(p => ({ key: p.key, val: p.val }))
            : [],
          type: 'asset',
        }))
        : [],
      experimentId: this.state.experimentId,
    };

    graphql
      .sendMutation(trialMutation(newTrial))
      .then((data) => {
        window.alert(`saved trial ${data.addUpdateTrial.id}`);
        // _this.props.showAll();
      })
      .catch((err) => {
        window.alert(`error: ${err}`);
      });
  };

  buildData = (trial) => {
    graphql
      .sendMutation(buildData(trial))
      .then((data) => {
        window.alert(data.buildExperimentData);
      })
      .catch((err) => {
        window.alert(`error: ${err}`);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {!this.state.editTrial ? (
          <div className={classes.root}>
            <ContentTable
              headerColumns={[
                '',
              ]}
            />
          </div>
        ) : (
          <TrialForm
            {...this.state.editTrial}
            experimentId={this.state.experimentId}
            cancel
            showAll={() => this.setState({ editTrial: null })}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ListOfTrials);
