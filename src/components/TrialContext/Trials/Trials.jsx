import React, { useContext, useEffect, useState } from 'react';
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

const Trials = (props) => {
  const { history, match, client, classes, theme } = props;
  const [state, setState] = useState({
    trialSet: {},
    trial: undefined,
    tabValue: undefined,
    isEditModeEnabled: false,
    update: false,
  });
  const { trialSet, tabValue } = state;

  const { setWorking } = useContext(WorkingContext);

  useEffect(() => {
    (async () => {
      setWorking(true);
      const data = await client.query({ query: trialSetsQuery(match.params.id) });
      const trialSet = data.data.trialSets.find(trialSet => trialSet.key === match.params.trialSetKey);
      setState({
        ...state,
        trialSet,
      });
      setWorking(false);
    })()
  }, [match.params.id]);

  const updateTrialFromCsv = async (e) => {
    try {
      setWorking(true);
      await uploadTrial(e, state.trialSet, props.client, props.match)
      setState({ ...state, update: true })
    } catch (err) {
      alert('uploading fail, please check the file')
    }
    setWorking(false);
  }

  const updateEntitiesTrialFromCsv = async (e, trial) => {
    try {
      setWorking(true);
      await uploadEntities(e, trial, props.client, props.match)
      setState({ ...state, update: true })
    } catch (err) {
      alert('uploading fail, please check the file')
    }
    setWorking(false);
  }

  const generateTableColumns = (trialSet) => {
    const columns = ['trial name', 'clone', 'entities', ''];
    if (!isEmpty(trialSet) && !isEmpty(trialSet.properties)) {
      columns.push('created', 'state', '');
    }
    return columns.map(title => { return { key: uuid(), title } });
  };

  const updateTrialSetNumberOfTrials = (n, cache) => {
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

  const cloneTrial = async (trialStatus, trial) => {
    setWorking(true);
    const clonedTrial = { ...trial };
    clonedTrial.key = uuid();
    clonedTrial.experimentId = match.params.id;
    clonedTrial.trialSetKey = match.params.trialSetKey;
    clonedTrial.cloneFrom = trialStatus;
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
          updateTrialSetNumberOfTrials
        );
      },
    });

    setState({ ...state, update: true });
    setWorking(false);
  };

  const setUpdated = () => {
    setState({ ...state, update: false });
  }

  const deleteTrial = async (trialToDelete) => {
    setWorking(true);
    const newEntity = { ...trialToDelete };
    newEntity.state = 'Deleted';
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
            updateTrialSetNumberOfTrials
          );
        },
      });

    setState({ ...state, update: true });
    setWorking(false);
  };

  const activateEditMode = (trial, devices) => {
    setState({
      ...state,
      isEditModeEnabled: true,
      trial,
      tabValue: devices ? 1 : 0,
    });
  };

  const returnFunc = (deleted) => {
    setState({
      ...state,
      isEditModeEnabled: false,
      tabValue: 0,
      update: deleted,
    });
  }

  const updateTrial = (trial) => {
    setState({ ...state, trial })
  }

  const tableHeadColumns = generateTableColumns(trialSet);

  return (
    <>
      <h1>vite try</h1>
      {state.isEditModeEnabled
        // eslint-disable-next-line react/jsx-wrap-multilines
        ? <TrialForm
          {...props}
          trial={state.trial}
          returnFunc={returnFunc}
          tabValue={tabValue}
          updateTrial={updateTrial}
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
                  activateEditMode={activateEditMode}
                  updateTrialFromCsv={updateTrialFromCsv}
                  updateEntitiesTrialFromCsv={updateEntitiesTrialFromCsv}
                  deleteTrial={deleteTrial}
                  cloneTrial={cloneTrial}
                />
              )
            }}
            update={state.update}
            setUpdated={setUpdated}
          />
        </>
      }
    </>
  );

}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles, { withTheme: true }),
)(Trials);
