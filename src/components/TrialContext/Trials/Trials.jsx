import React from 'react';
import { withStyles } from '@material-ui/core';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import trialsQuery from '../utils/trialQuery';
import { styles } from './styles';
import { TRIAL_SETS_DASH, TRIALS, TRIAL_MUTATION, TRIAL_SETS, TRIAL_SET_MUTATION } from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import trialSetsQuery from '../utils/trialSetQuery';
import ContentTable from '../../ContentTable';
import TrialForm from '../TrialForm/TrialForm';
import trialMutation from '../TrialForm/utils/trialMutation';
import { updateCache } from '../../../apolloGraphql';
import { downloadTrials } from './downloadCsv';
import { uploadEntities, uploadTrial } from './uploadCsv';
import { TrialRow } from './TrialRow';
import { displayCloneData } from './trialUtils';
import { WorkingContext } from '../../AppLayout';

class Trials extends React.Component {
  state = {
    trialSet: {},
  };

  static contextType = WorkingContext;

  componentDidMount() {
    this.context.setWorking(true);
    (async () => {
      const { match, client } = this.props;
      const data = await client.query({ query: trialSetsQuery(match.params.id) });
      const trialSet = data.data.trialSets.find(trialSet => trialSet.key === match.params.trialSetKey);
      this.setState({
        trialSet,
      });
      this.context.setWorking(false);
    })()
  }

  updateTrialFromCsv = async (e) => {
    try {
      this.context.setWorking(true);
      await uploadTrial(e, this.state.trialSet, this.props.client, this.props.match)
      this.setState({ update: true })
    } catch (err) {
      alert('uploading fail, please check the file')
    }
    this.context.setWorking(false);
  }
  updateEntitiesTrialFromCsv = async (e, trial) => {
    try {
      this.context.setWorking(true);
      await uploadEntities(e, trial, this.props.client, this.props.match)
      this.setState({ update: true })
    } catch (err) {
      alert('uploading fail, please check the file')
    }
    this.context.setWorking(false);
  }

  generateTableColumns = (trialSet) => {
    const columns = ['trial name', 'clone', 'entities', ''];
    if (!isEmpty(trialSet) && !isEmpty(trialSet.properties)) {
      columns.push('created', 'state', '');
    }
    return columns.map(title => { return { key: uuid(), title } });
  };

  updateTrialSetNumberOfTrials = (n, cache) => {
    const { match } = this.props;
    const { trialSet } = this.state;
    trialSet.numberOfTrials = n[trialSet.key];
    updateCache(
      cache,
      { data: { [TRIAL_SET_MUTATION]: trialSet } },
      trialSetsQuery(match.params.id),
      TRIAL_SETS,
      TRIAL_SET_MUTATION,
      true,
    );
  };

  cloneTrial = async (state, trial) => {
    this.context.setWorking(true);
    const { match, client } = this.props;
    const clonedTrial = { ...trial };
    clonedTrial.key = uuid();
    clonedTrial.experimentId = match.params.id;
    clonedTrial.trialSetKey = match.params.trialSetKey;
    clonedTrial.cloneFrom = state;
    clonedTrial.cloneFromTrailKey = trial.key;
    clonedTrial.name = `${trial.name} clone`;
    await client.mutate({
      mutation: trialMutation(clonedTrial),
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
          this.updateTrialSetNumberOfTrials
        );
      },
    });

    this.setState({ update: true });
    this.context.setWorking(false);
  };

  setUpdated = () => {
    this.setState({ update: false });
  }

  deleteTrial = async (trialToDelete) => {
    this.context.setWorking(true);
    // const newEntity = this.state.trial;
    const newEntity = { ...trialToDelete };
    newEntity.state = 'Deleted';
    const { match, client } = this.props;
    newEntity.experimentId = match.params.id;
    newEntity.numberOfEntities = newEntity.numberOfEntities || 0;
    newEntity.trialSetKey = match.params.trialSetKey;

    const mutation = trialMutation;
    await client
      .mutate({
        mutation: mutation(newEntity),
        update: (cache, mutationResult) => {
          updateCache(
            cache,
            mutationResult,
            trialsQuery(match.params.id, match.params.trialSetKey),
            TRIALS,
            TRIAL_MUTATION,
            true,
            'trialSetKey',
            this.updateTrialSetNumberOfTrials
          );
        },
      });

    this.setState({ update: true });
    this.context.setWorking(false);
  };

  activateEditMode = (trial, devices) => {
    this.setState({
      isEditModeEnabled: true,
      trial,
      tabValue: devices ? 1 : 0,
    });
  };

  returnFunc = (deleted) => {
    this.setState({
      isEditModeEnabled: false,
      tabValue: 0,
      update: deleted,
    });
  }
  updateTrial = (trial) => {
    this.setState({ trial })
  }

  render() {
    const { history, match, client, classes, theme } = this.props;
    const { trialSet, tabValue } = this.state;
    const tableHeadColumns = this.generateTableColumns(trialSet);

    return (
      <>
        {this.state.isEditModeEnabled
          // eslint-disable-next-line react/jsx-wrap-multilines
          ? <TrialForm
            {...this.props}
            trial={this.state.trial}
            returnFunc={this.returnFunc}
            tabValue={tabValue}
            updateTrial={this.updateTrial}
          />
          // eslint-disable-next-line react/jsx-wrap-multilines
          : <>
            <ContentHeader
              withSearchInput
              title="Trials set"
              searchPlaceholder="Search Trials"
              withAddButton
              addButtonText="Add trial"
              withBackButton
              backButtonHandler={() => history.push(`/experiments/${match.params.id}/${TRIAL_SETS_DASH}`)}
              rightDescription={trialSet ? trialSet.name : ''}
              addButtonHandler={() => window.location.href = `/experiments/${match.params.id}/${TRIAL_SETS_DASH}/${match.params.trialSetKey}/add-trial`}
              withDownloadButton
              downloadButtonText="Download trials"
              downloadButtonHandler={() => downloadTrials(client, match, trialSet, displayCloneData)}
            />
            <ContentTable
              contentType={TRIALS}
              query={trialsQuery(match.params.id, match.params.trialSetKey)}
              tableHeadColumns={tableHeadColumns}
              renderRow={(trial, index, trialsArray) => {
                return (
                  <TrialRow
                    trial={trial}
                    trialsArray={trialsArray}
                    trialSet={trialSet}
                    classes={classes}
                    theme={theme}
                    client={client}
                    match={match}
                    activateEditMode={this.activateEditMode}
                    updateTrialFromCsv={this.updateTrialFromCsv}
                    updateEntitiesTrialFromCsv={this.updateEntitiesTrialFromCsv}
                    deleteTrial={this.deleteTrial}
                    cloneTrial={this.cloneTrial}
                  />
                )
              }}
              update={this.state.update}
              setUpdated={this.setUpdated}
            />
          </>
        }
      </>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles, { withTheme: true }),
)(Trials);
