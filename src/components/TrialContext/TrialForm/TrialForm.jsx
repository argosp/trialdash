/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core';
import update from 'immutability-helper';
import uuid from 'uuid/v4';
import moment from 'moment';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import classnames from 'classnames';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import trialMutation from './utils/trialMutation';
import { styles } from './styles';
import ContentHeader from '../../ContentHeader';
import CustomInput from '../../CustomInput';
import Footer from '../../Footer';
import {
  TRIAL_SETS_DASH,
  TRIAL_SETS,
  TRIALS,
  TRIAL_MUTATION,
  TRIAL_SET_MUTATION,
  COLORS_STATUSES,
} from '../../../constants/base';
import { PenIcon } from '../../../constants/icons';
import StatusBadge from '../../StatusBadge';
import StyledTabs from '../../StyledTabs';
import trialSetsQuery from '../utils/trialSetQuery';
import trialsQuery from '../utils/trialQuery';
import { updateCache } from '../../../apolloGraphql';
import trialMutationUpdate from './utils/trialMutationUpdate';
import ConfirmDialog from '../../ConfirmDialog';
import { TabPanel } from '../TabPanel';
import EntityPlanner from '../../EntityPlanner/EntityPlanner';

const TrialForm = (props) => {
  const [state, setState] = useState({
    trial: initTrial(),
    trialSet: {},
    tabValue: props.tabValue || 0,
    changedEntities: [],
    triggerUpdate: 0,
    confirmOpen: false
  });

  const initTrial = () => {
    return {
      key: props.trial ? props.trial.key : uuid(),
      trialSetKey: props.match.params.trialSetKey,
      experimentId: props.match.params.id,
      name: props.trial ? props.trial.name : '',
      status: props.trial && props.trial.status ? props.trial.status : 'design',
      numberOfEntities: props.trial ? props.trial.numberOfEntities : 0,
      properties: props.trial && props.trial.properties ? [...props.trial.properties] : [],
      entities: props.trial && props.trial.entities ? [...props.trial.entities.map(e => { return ({ ...e, properties: [...e.properties] }) })] : [],
      deployedEntities: props.trial && props.trial.deployedEntities ? [...props.trial.deployedEntities] : [],
    }
  }

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

      setState(state => ({
        trial: {
          ...state.trial,
          properties,
        },
        trialSet,
      }));
    });
  }, []);

  const changeTab = (event, tabValue) => {
    setState({ tabValue });
  };

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
    setState(state => ({
      changed: true,
      trial: {
        ...state.trial,
        properties: update(state.trial.properties, {
          [indexOfProperty]: { val: { $set: value }, key: { $set: propertyKey } },
        }),
      },
    }));
  };

  const updateChangedEntities = (changedEntities, entityObj) => {
    if (changedEntities.findIndex(e => e.key === entityObj.key) === -1)
      setState({ changedEntities: [...state.changedEntities, entityObj] })
  }

  const onInputChange = (e, inputName) => {
    const { value } = e.target;

    if (inputName === 'status' && value !== state.trial.status) {
      setState({ anchorMenu: null, confirmStatusOpen: true, newStatus: value });
    } else {

      setState(state => ({
        editableStatus: false,
        anchorMenu: null,
        changed: true,
        trial: {
          ...state.trial,
          [inputName]: value,
        },
      }));
    }
  };

  const closeForm = (deleted) => {
    const { changed } = state;
    if (deleted !== true && changed) {
      setState({ confirmOpen: true });
      return;
    }
    const { match, history, returnFunc } = props;

    if (returnFunc) returnFunc(deleted);
    else {
      history.push(
        `/experiments/${match.params.id}/${TRIAL_SETS_DASH}/${match.params.trialSetKey}/${TRIALS}`,
      );
    }
  };

  const updateAfterSubmit = (n, cache, trial) => {
    updateTrialSetNumberOfTrials(n, cache);
    trial.experimentId = props.match.params.id;
    //setState({ trial });
    props.updateTrial(trial)
  }

  const updateTrialSetNumberOfTrials = (n, cache) => {
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
  };

  const submitTrial = async (newTrial, deleted, newStatus) => {
    const updatedTrial = newTrial;
    const { match, client, returnFunc } = props;
    const { trialSet, changedEntities } = state;
    if (deleted) updatedTrial.state = 'Deleted';
    if (newStatus) updatedTrial.status = newStatus;
    let property;
    let invalid;
    if (trialSet.properties) {
      trialSet.properties.forEach((p) => {
        property = updatedTrial.properties.find(ntp => ntp.key === p.key);
        if (!property) {
          property = {
            key: p.key,
            val: getValue(p.key, p.defaultValue)
          };
          updatedTrial.properties.push(property);
        }
        if (p.required && !property.val) {
          invalid = true;
          property.invalid = true;
        } else {
          delete property.invalid;
        }
      });
      if (invalid) {
        setState({ tabValue: 0 });
        return;
      }
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

    setState({ changed: false, confirmStatusOpen: false });
    if (deleted) closeForm(deleted);
  };

  const getValue = (key, defaultValue) => {
    const properties = state.trial.properties;
    const p = ((properties && properties.length) ? properties.findIndex(pr => pr.key === key) : -1);
    return (p !== -1 ? properties[p].val : defaultValue);
  }

  const getInvalid = (key) => {
    const properties = state.trial.properties;
    const p = ((properties && properties.length) ? properties.findIndex(pr => pr.key === key) : -1);
    return (p !== -1 ? properties[p].invalid : false);
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
    setState({ trial });
  };

  const setEditableStatus = (editableStatus) => {
    setState({ editableStatus });
  }

  const handleMenuClick = (event) => {
    setState({
      anchorMenu: event.currentTarget,
    });
  };

  const handleMenuClose = (anchor) => {
    setState({ [anchor]: null });
    setEditableStatus(false)
  };

  const setCurrent = (property) => {
    if (property.type === 'time') onPropertyChange({ target: { value: moment().format('HH:mm') } }, property.key)
    if (property.type === 'date') onPropertyChange({ target: { value: moment().format('YYYY-MM-DD') } }, property.key)
    if (property.type === 'datetime-local') onPropertyChange({ target: { value: moment().format('YYYY-MM-DDTHH:mm') } }, property.key)
  }
  const setConfirmOpen = (open) => {
    setState({ confirmOpen: open });
  }
  const cancelChangeStatus = () => {
    setState({ confirmStatusOpen: false });
  }
  const cancelHandler = () => {
    setState({ trial: initTrial(), changedEntities: [], changed: false, triggerUpdate: state.triggerUpdate + 1 })
  }

  const { classes, theme } = props;

  const {
    tabValue,
    trialSet,
    trial,
    editableStatus,
    anchorMenu,
    confirmOpen,
    confirmStatusOpen,
    newStatus,
  } = state;

  return (
    <>
      <div>
        <ContentHeader
          backButtonHandler={closeForm}
          topDescription={trialSet.name}
          withBackButton
          rightDescription={(
            trial.status && <StatusBadge
              onClick={handleMenuClick}
              onMouseEnter={() => setEditableStatus(true)}
              onMouseLeave={() => setEditableStatus(false)}
              className={classes.statusBadge}
              title={
                <Grid
                  container
                  wrap="nowrap"
                  justifyContent="space-between"
                  alignItems="center"
                  alignContent="space-between"
                >
                  <span>{trial.status}</span>
                  {editableStatus && <PenIcon className={classes.penIcon} />}
                </Grid>
              }
              color={theme.palette[COLORS_STATUSES[trial.status].color][COLORS_STATUSES[trial.status].level]}
            />
          )}

          title={trial.name || 'trial name goes here'}
          className={classes.header}
          rightComponent={(
            <StyledTabs
              tabs={[
                { key: trial.key + '_G', label: 'General', id: 'trial-tab-0' },
                { key: trial.key + '_D', label: 'Entities', id: 'trial-tab-1' },
              ]}
              value={tabValue}
              onChange={changeTab}
              ariaLabel="trial tabs"
            />
          )}
        />
        <Menu
          onMouseEnter={() => setEditableStatus(true)}
          onMouseLeave={() => setEditableStatus(false)}
          id="statuses-menu"
          classes={{ paper: classes.menu }}
          open={Boolean(anchorMenu)}
          onClose={() => handleMenuClose('anchorMenu')}
          anchorEl={anchorMenu}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {['design', 'deploy', 'execution', 'complete'].map((i) => <MenuItem
            key={uuid()}
            classes={{ root: classes.menuItem }}
            onClick={e => onInputChange({ target: { value: i } }, 'status')}
          >
            <Grid
              container
              wrap="nowrap"
              alignItems="center"
            >
              <div className={(classnames(classes.rect, classes[i]))}></div>
              {i}
            </Grid>
          </MenuItem>)}
        </Menu>
      </div>
      <TabPanel value={tabValue} index={0}>
        <CustomInput
          id="trial-name"
          className={classes.property}
          onChange={e => onInputChange(e, 'name')}
          label="Name"
          bottomDescription="a short description"
          value={trial.name}
        />
        {trialSet.properties
          ? trialSet.properties.map(property => (
            <CustomInput
              id={`trial-property-${property.key}`}
              className={classes.property}
              key={property.key}
              onChange={e => onPropertyChange(e, property.key)}
              label={property.label}
              bottomDescription={property.description}
              value={getValue(property.key, property.defaultValue)}
              values={property.value}
              multiple={property.multipleValues}
              type={property.type}
              invalid={getInvalid(property.key)}
              endAdornment={(['date', 'time', 'datetime-local'].indexOf(property.type) !== -1) ?
                <InputAdornment position="end">
                  <Button onClick={() => setCurrent(property)}>
                    Fill current
                  </Button>
                </InputAdornment> :
                null
              }
            />
          ))
          : null}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {tabValue === 1 &&
          <EntityPlanner
            trial={trial}
            updateLocation={updateLocation}
            submitTrial={submitTrial}
          />
        }
      </TabPanel>
      {(tabValue === 0) && <Footer
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
          setState({ changed: false }, () => {
            closeForm()
          });
        }}
        cancelText="No, I want to stay"
        onCancel={() => setState({ confirmOpen: false })}
        cancelColor="#474747"
      >
        Information won't be saved
      </ConfirmDialog>
      <ConfirmDialog
        title={'You are going to change trial status'}
        open={confirmStatusOpen || false}
        confirmText="Save changes and change status"
        onConfirm={() => {
          setState({ changed: false }, () => {
            submitTrial(trial, false, newStatus);
          });
        }}
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
