/* eslint-disable prefer-destructuring */
import React from 'react';
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

class TrialForm extends React.Component {
  state = {
    trial: this.initTrial(),
    trialSet: {},
    tabValue: this.props.tabValue || 0,
    showFooter: true,
    changedEntities: [],
    triggerUpdate: 0,
    confirmOpen: false
  };

  initTrial() {
    const entities = [];
    if (this.props.trial && this.props.trial.entities) {
      for (const e of this.props.trial.entities) {
        if (e) {
          entities.push({ ...e, properties: [...e.properties] });
        }
      }
    };
    return {
      key: this.props.trial ? this.props.trial.key : uuid(),
      trialSetKey: this.props.match.params.trialSetKey,
      experimentId: this.props.match.params.id,
      name: this.props.trial ? this.props.trial.name : '',
      status: this.props.trial && this.props.trial.status ? this.props.trial.status : 'design',
      numberOfEntities: this.props.trial ? this.props.trial.numberOfEntities : 0,
      properties: this.props.trial && this.props.trial.properties ? [...this.props.trial.properties] : [],
      entities,
      deployedEntities: this.props.trial && this.props.trial.deployedEntities ? [...this.props.trial.deployedEntities] : [],
    }
  }

  componentDidMount() {
    const { client, match, trial } = this.props;
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

      this.setState(state => ({
        trial: {
          ...state.trial,
          properties,
        },
        trialSet,
      }));
    });
  }

  changeTab = (event, tabValue) => {
    this.setState({ tabValue });
  };

  onPropertyChange = (e, propertyKey) => {
    if (!e.target) return;
    let { value } = e.target;
    if (e.target.type === 'checkbox') value = e.target.checked.toString();
    let indexOfProperty = this.state.trial.properties.findIndex(
      property => property.key === propertyKey,
    );

    if (indexOfProperty === -1) {
      this.state.trial.properties.push({ val: value, key: propertyKey });
      indexOfProperty = this.state.trial.properties.length - 1;
    }
    this.setState(state => ({
      changed: true,
      trial: {
        ...state.trial,
        properties: update(state.trial.properties, {
          [indexOfProperty]: { val: { $set: value }, key: { $set: propertyKey } },
        }),
      },
    }));
  };

  updateChangedEntities = (changedEntities, entityObj) => {
    if (changedEntities.findIndex(e => e.key === entityObj.key) === -1)
      this.setState({ changedEntities: [...this.state.changedEntities, entityObj] })
  }
  onInputChange = (e, inputName) => {
    const { value } = e.target;

    if (inputName === 'status' && value !== this.state.trial.status) {
      this.setState({
        trialStatus: {
          ...this.state.trialStatus,
          anchorMenu: null,
        },
        confirmStatusOpen: true,
        newStatus: value
      });
    } else {
      this.setState(state => ({
        trialStatus: {
          editableStatus: false,
          anchorMenu: null,
        },
        changed: true,
        trial: {
          ...state.trial,
          [inputName]: value,
        },
      }));
    }
  };

  closeForm = (deleted) => {
    const { changed } = this.state;
    if (deleted !== true && changed) {
      this.setState({ confirmOpen: true });
      return;
    }
    const { match, history, returnFunc } = this.props;

    if (returnFunc) returnFunc(deleted);
    else {
      history.push(
        `/experiments/${match.params.id}/${TRIAL_SETS_DASH}/${match.params.trialSetKey}/${TRIALS}`,
      );
    }
  };

  updateAfterSubmit = (n, cache, trial) => {
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
    trial.experimentId = this.props.match.params.id;
    //this.setState({ trial });
    this.props.updateTrial(trial)
  }

  fillProperties = (trialSet, updatedTrial) => {
    let invalid = false;
    let property;
    if (trialSet.properties) {
      trialSet.properties.forEach((p) => {
        property = updatedTrial.properties.find(ntp => ntp.key === p.key);
        if (!property) {
          property = {
            key: p.key,
            val: this.getValue(p.key, p.defaultValue)
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
    }
    return invalid;
  }

  submitTrial = async (newTrial, deleted, newStatus) => {
    const updatedTrial = newTrial;
    const { match, client, returnFunc } = this.props;
    const { trialSet, changedEntities } = this.state;
    if (deleted) updatedTrial.state = 'Deleted';
    if (newStatus) updatedTrial.status = newStatus;

    const invalid = this.fillProperties(trialSet, updatedTrial);
    if (invalid) {
      this.setState({ tabValue: 0 });
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
          this.updateAfterSubmit
        );
      },
    });

    this.setState({ changed: false, confirmStatusOpen: false });
    if (deleted) this.closeForm(deleted);
  };

  getValue = (key, defaultValue) => {
    const properties = this.state.trial.properties;
    const p = ((properties && properties.length) ? properties.findIndex(pr => pr.key === key) : -1);
    return (p !== -1 ? properties[p].val : defaultValue);
  }

  updateLocation = async (...entities) => {
    const updatedTrial = {};
    const { match, client } = this.props;
    const { trial } = this.state;
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
    this.setState({ trial });
  };

  setConfirmOpen = (open) => {
    this.setState({ confirmOpen: open });
  }
  cancelChangeStatus = () => {
    this.setState({ confirmStatusOpen: false });
  }
  cancelHandler = () => {
    this.setState({ trial: this.initTrial(), changedEntities: [], changed: false, triggerUpdate: this.state.triggerUpdate + 1 })
  }
  render() {
    const { classes, theme } = this.props;
    const {
      tabValue,
      trialSet,
      trial,
      showFooter,
      confirmOpen,
      confirmStatusOpen,
      newStatus,
    } = this.state;

    return (
      <>
        <ContentHeader
          backButtonHandler={this.closeForm}
          topDescription={trialSet.name}
          withBackButton
          title={trial.name || 'trial name goes here'}
          className={classes.header}

          rightDescription={(
            trial.status && (
              <TrialStatusMenu
                trialStatus={this.state.trialStatus || {}}
                setTrialStatus={v => this.setState({ trialStatus: v })}
                onInputChange={this.onInputChange}
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
              onChange={this.changeTab}
              ariaLabel="trial tabs"
            />
          )}
        />
        <TabPanel value={tabValue} index={0}>
          <TrialPropertiesEditor
            classes={classes}
            trial={trial}
            trialSet={trialSet}
            onInputChange={this.onInputChange}
            onPropertyChange={this.onPropertyChange}
            getValue={this.getValue}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <EntityPlanner
            trial={trial}
            updateLocation={this.updateLocation}
            submitTrial={this.submitTrial}
            showFooter={(val) => this.setState({ val })}
            history={this.props.history}
          />
        </TabPanel>
        {(tabValue === 0 || showFooter) && <Footer
          cancelButtonHandler={this.cancelHandler}
          saveButtonDisabled={!this.state.changed}
          saveButtonHandler={() => this.submitTrial(trial)}
          cancelButtonDisabled={!this.state.changed}
        />}
        <ConfirmDialog
          title={'There are unsaved changes. Do you want to leave without saving the changes?'}
          open={confirmOpen}
          setOpen={() => this.setConfirmOpen(false)}
          confirmText="Yes, I want to leave"
          onConfirm={() => {
            this.setState({ changed: false }, () => {
              this.closeForm()
            });
          }}
          cancelText="No, I want to stay"
          onCancel={() => this.setState({ confirmOpen: false })}
          cancelColor="#474747"
        >
          Information won't be saved
        </ConfirmDialog>
        <ConfirmDialog
          title={'You are going to change trial status'}
          open={confirmStatusOpen || false}
          confirmText="Save changes and change status"
          onConfirm={() => {
            this.setState({ changed: false }, () => {
              this.submitTrial(trial, false, newStatus);
            });
          }}
          cancelText="I don't want to change status"
          onCancel={this.cancelChangeStatus}
          cancelColor="#474747"
        >
          You have to save your changes before
        </ConfirmDialog>
      </>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles, { withTheme: true }),
)(TrialForm);
