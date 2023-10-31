/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react';
import { withStyles } from '@mui/styles';
import update from 'immutability-helper';
import uuid from 'uuid/v4';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import trialMutation from './utils/trialMutation';
import { styles } from './styles';
import ContentHeader from '../../ContentHeader';
import Footer from '../../Footer';
import {
  TRIAL_SETS_DASH,
  TRIAL_SETS,
  TRIALS,
  TRIAL_MUTATION,
  TRIAL_SET_MUTATION
} from '../../../constants/base';
import StyledTabs from '../../StyledTabs';
import trialSetsQuery from '../utils/trialSetQuery';
import trialsQuery from '../utils/trialQuery';
import { updateCache } from '../../../apolloGraphql';
import trialMutationUpdate from './utils/trialMutationUpdate';
import ConfirmDialog from '../../ConfirmDialog';
import { TabPanel } from '../TabPanel';
import EntityPlanner from '../../EntityPlanner/EntityPlanner';
import { TrialPropertiesEditor } from './TrialPropertiesEditor';
import { TrialStatusMenu } from './TrialStatusMenu';

const TrialForm = (props) => {

  const initTrial = () => {
    const entities = [];
    if (props.trial && props.trial.entities) {
      for (const e of props.trial.entities) {
        if (e) {
          entities.push({ ...e, properties: [...e.properties] });
        }
      }
    };
    return {
      key: props.trial ? props.trial.key : uuid(),
      trialSetKey: props.match.params.trialSetKey,
      experimentId: props.match.params.id,
      name: props.trial ? props.trial.name : '',
      status: props.trial && props.trial.status ? props.trial.status : 'design',
      numberOfEntities: props.trial ? props.trial.numberOfEntities : 0,
      properties: props.trial && props.trial.properties ? [...props.trial.properties] : [],
      entities,
      deployedEntities: props.trial && props.trial.deployedEntities ? [...props.trial.deployedEntities] : [],
    }
  }

  const [state, setState] = useState({
    trial: initTrial(),
    trialSet: {},
    tabValue: props.tabValue || 0,
    showFooter: true,
    changedEntities: [],
    triggerUpdate: 0,
    confirmOpen: false
  });

  useEffect(() => {
    const { client, match, trial } = props;
    client.query({ query: trialSetsQuery(match.params.id) }).then((data) => {
      const trialSet = data.data.trialSets.find(
        item => item.key === match.params.trialSetKey,
      );

      let properties;
      if (!trial) {
        properties = [];
        trialSet.properties.forEach(property => properties.push({ key: property.key, val: property.defaultValue }));
      } else {
        properties = [...trial.properties] || [];
      }

      setState({
        ...state,
        trial: {
          ...state.trial,
          properties,
        },
        trialSet,
      });
    });
  }, []);

  const onPropertyChange = (e, propertyKey) => {
    if (!e.target) return;
    let { value } = e.target;
    if (e.target.type === 'checkbox') value = e.target.checked.toString();
    let indexOfProperty = state.trial.properties.findIndex(
      property => property.key === propertyKey,
    );

    if (indexOfProperty === -1) {
      state.trial.properties.push({ val: value, key: propertyKey });
      indexOfProperty = state.trial.properties.length - 1;
    }
    setState({
      ...state,
      changed: true,
      trial: {
        ...state.trial,
        properties: update(state.trial.properties, {
          [indexOfProperty]: { val: { $set: value }, key: { $set: propertyKey } },
        }),
      },
    });
  };

  const onInputChange = (e, inputName) => {
    const { value } = e.target;

    if (inputName === 'status' && value !== state.trial.status) {
      setState({
        ...state,
        trialStatus: {
          ...state.trialStatus,
          anchorMenu: null,
        },
        confirmStatusOpen: true,
        newStatus: value
      });
    } else {
      setState({
        ...state,
        trialStatus: {
          editableStatus: false,
          anchorMenu: null,
        },
        changed: true,
        trial: {
          ...state.trial,
          [inputName]: value,
        },
      });
    }
  };

  const closeForm = () => {
    const { changed } = state;
    const { match, history, returnFunc } = props;
    if (changed) {
      setState({ ...state, confirmOpen: true });
    } else if (returnFunc) {
      returnFunc(false);
    } else {
      history.push(`/experiments/${match.params.id}/${TRIAL_SETS_DASH}/${match.params.trialSetKey}/${TRIALS}`);
    }
  };

  const updateAfterSubmit = (n, cache, trial) => {
    const { match } = props;
    const { trialSet } = state;
    trialSet.numberOfTrials = n[trialSet.key];
    updateCache(
      cache,
      { data: { [TRIAL_SET_MUTATION]: trialSet } },
      trialSetsQuery(match.params.id),
      TRIAL_SETS,
      TRIAL_SET_MUTATION,
      true,
    );
    trial.experimentId = props.match.params.id;
    //setState({ ...state, trial });
    props.updateTrial(trial)
  }

  const fillProperties = (trialSet, updatedTrial) => {
    for (const p of trialSet.properties || []) {
      let property = updatedTrial.properties.find(ntp => ntp.key === p.key);
      if (!property) {
        const val = getValue(p.key, p.defaultValue);
        property = { key: p.key, val };
        updatedTrial.properties.push(property);
      }
      if (p.required && !property.val) {
        property.invalid = true;
      } else {
        delete property.invalid;
      }
    }
    const invalid = updatedTrial.properties.some(prop => prop.invalid);
    return invalid;
  }

  const submitTrial = async (newTrial, newStatus) => {
    const updatedTrial = newTrial;
    const { match, client, returnFunc } = props;
    const { trialSet, changedEntities } = state;
    if (newStatus) updatedTrial.status = newStatus;

    const invalid = fillProperties(trialSet, updatedTrial);
    if (invalid) {
      setState({ ...state, tabValue: 0 });
      return;
    }

    await client.mutate({
      mutation: trialMutation(updatedTrial, changedEntities),
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
          returnFunc,
          'trialSetKey',
          updateAfterSubmit
        );
      },
    });

    setState({ ...state, changed: false, confirmStatusOpen: false });
  };

  const getValue = (key, defaultValue) => {
    const properties = state.trial.properties;
    const p = ((properties && properties.length) ? properties.findIndex(pr => pr.key === key) : -1);
    return (p !== -1 ? properties[p].val : defaultValue);
  }

  const updateLocation = async (...entities) => {
    const updatedTrial = {};
    const { match, client } = props;
    const { trial } = state;
    updatedTrial.key = trial.key;
    updatedTrial.experimentId = trial.experimentId;
    updatedTrial.trialSetKey = trial.trialSetKey;
    updatedTrial[!trial.status || trial.status === 'design' ? 'entities' : 'deployedEntities'] = entities;
    await client.mutate({
      mutation: trialMutationUpdate(updatedTrial, entities),
      update: (cache, mutationResult) => {
        updateCache(
          cache,
          mutationResult,
          trialsQuery(match.params.id, match.params.trialSetKey),
          TRIALS,
          TRIAL_MUTATION,
          true,
        );
      },
    });

    let isNew = true;
    let entitiesField = (!trial.status || trial.status === 'design') ? 'entities' : 'deployedEntities'
    entities.forEach(entity => {
      trial[entitiesField].forEach((item, i) => {
        if (item.key === entity.key) {
          trial[entitiesField][i].properties.forEach((property, j) => {
            if (property.key === entity.properties[0].key) {
              trial[entitiesField][i].properties[j] = entity.properties[0];
            }
          });
          isNew = false;
        }
      });
      if (isNew) trial[entitiesField].push(entity);
    });
    setState({ ...state, trial });
  };

  const setConfirmOpen = (open) => {
    setState({ ...state, confirmOpen: open });
  }
  const cancelChangeStatus = () => {
    setState({ ...state, confirmStatusOpen: false });
  }
  const cancelHandler = () => {
    setState({ ...state, trial: initTrial(), changedEntities: [], changed: false, triggerUpdate: state.triggerUpdate + 1 })
  }

  const { classes, theme } = props;
  const {
    tabValue,
    trialSet,
    trial,
    showFooter,
    confirmOpen,
    confirmStatusOpen,
    newStatus,
  } = state;

  return (
    <>
      <ContentHeader
        backButtonHandler={closeForm}
        topDescription={trialSet.name}
        withBackButton
        title={trial.name || 'trial name goes here'}
        className={classes.header}

        rightDescription={(
          trial.status && (
            <TrialStatusMenu
              trialStatus={state.trialStatus || {}}
              setTrialStatus={trialStatus => setState({ ...state, trialStatus })}
              onInputChange={onInputChange}
              trial={trial}
            />
          )
        )}
        rightComponent={(
          <StyledTabs
            tabs={[
              { key: trial.key + '_G', label: 'General', id: 'trial-tab-0' },
              { key: trial.key + '_D', label: 'Entities', id: 'trial-tab-1' },
            ]}
            value={tabValue}
            onChange={(e, tabValue) => setState({ ...state, tabValue })}
            ariaLabel="trial tabs"
          />
        )}
      />
      <TabPanel value={tabValue} index={0}>
        <TrialPropertiesEditor
          classes={classes}
          trial={trial}
          trialSet={trialSet}
          onInputChange={onInputChange}
          onPropertyChange={onPropertyChange}
          getValue={getValue}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <EntityPlanner
          trial={trial}
          updateLocation={updateLocation}
          submitTrial={submitTrial}
          showFooter={(val) => setState({ ...state, val })}
          history={props.history}
        />
      </TabPanel>
      {(tabValue === 0 || showFooter) && <Footer
        cancelButtonHandler={cancelHandler}
        saveButtonDisabled={!state.changed}
        saveButtonHandler={() => submitTrial(trial)}
        cancelButtonDisabled={!state.changed}
      />}
      <ConfirmDialog
        title={'There are unsaved changes. Do you want to leave without saving the changes?'}
        open={confirmOpen}
        setOpen={() => setConfirmOpen(false)}
        confirmText="Yes, I want to leave"
        onConfirm={() => {
          setState({ ...state, changed: false }, () => {
            closeForm()
          });
        }}
        cancelText="No, I want to stay"
        onCancel={() => setState({ ...state, confirmOpen: false })}
        cancelColor="#474747"
      >
        Information won't be saved
      </ConfirmDialog>
      <ConfirmDialog
        title={'You are going to change trial status'}
        open={confirmStatusOpen || false}
        confirmText="Save changes and change status"
        onConfirm={() => submitTrial(trial, newStatus)}
        cancelText="I don't want to change status"
        onCancel={cancelChangeStatus}
        cancelColor="#474747"
      >
        You have to save your changes before
      </ConfirmDialog>
    </>
  );
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles, { withTheme: true }),
)(TrialForm);
