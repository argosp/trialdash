import React from 'react';
import { withStyles } from '@material-ui/core';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
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

class Trials extends React.Component {
  state = {
    trialSet: {},
    loading: false
  };

  componentDidMount() {
    (async () => {
      // this.setState({ loading: true })
      const { match, client } = this.props;
      const data = await client.query({ query: trialSetsQuery(match.params.id) });
      const trialSet = data.data.trialSets.find(trialSet => trialSet.key === match.params.trialSetKey);
      this.setState({
        trialSet,
        // loading: false
      });
    })()
  }

  updateTrialFromCsv = async (e) => {
    try {
      this.setState({ loading: true })
      await uploadTrial(e, this.state.trialSet, this.props.client, this.props.match)
      this.setState({ update: true })
      this.setState({ loading: false })
    } catch (err) {
      alert('uploading fail, please check the file')
      this.setState({ loading: false })
    }
  }
  updateEntitiesTrialFromCsv = async (e, trial) => {
    try {
      this.setState({ loading: true })
      await uploadEntities(e, trial, this.props.client, this.props.match)
      this.setState({ update: true })
      this.setState({ loading: false })
    } catch (err) {
      alert('uploading fail, please check the file')
      this.setState({ loading: false })
    }
  }

  generateTableColumns = (trialSet) => {
    const columns = [
      { key: uuid(), title: 'trial name' },
      { key: uuid(), title: 'clone' },
      { key: uuid(), title: 'entities' },
      { key: uuid(), title: '' },
    ];

    if (!isEmpty(trialSet) && !isEmpty(trialSet.properties)) {
      trialSet.properties.forEach((property, index) => {
        // the three last columns are static (created, state and buttons)
        if (index === trialSet.properties.length - 1) {
          columns.push(
            // { key: uuid(), title: '' }, //property.label },
            { key: uuid(), title: 'created' },
            { key: uuid(), title: 'state' },
            { key: uuid(), title: '' },
          );

          return;
        }

        // columns.push({ key: uuid(), title: '' });//property.label });
      });
    }

    return columns;
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
  };

  setUpdated = () => {
    this.setState({ update: false });
  }

  deleteTrial = async (trialToDelete) => {
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
    const { trialSet, tabValue, loading } = this.state;
    const tableHeadColumns = this.generateTableColumns(trialSet);

    return (
      <LoadingOverlay
        active={loading}
        spinner
        text='Please wait...'
      >
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
      </LoadingOverlay>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles, { withTheme: true }),
)(Trials);
