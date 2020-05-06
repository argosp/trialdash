/* eslint-disable prefer-destructuring */
import React from 'react';
import { withStyles } from '@material-ui/core';
import update from 'immutability-helper';
import uuid from 'uuid/v4';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import classnames from 'classnames';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import trialMutation from './utils/trialMutation';
import trialSetMutation from '../utils/trialSetMutation';
import { styles } from './styles';
import ContentHeader from '../../ContentHeader';
import CustomInput from '../../CustomInput';
import Footer from '../../Footer';
import AddDevicePanel from '../../AddDevicePanel';
import DevicesGrid from './devicesGrid';
import {
  TRIAL_SETS_DASH,
  TRIAL_SETS,
  TRIALS,
  TRIAL_MUTATION,
  TRIAL_SET_MUTATION,
} from '../../../constants/base';
import StatusBadge from '../../StatusBadge';
import StyledTabs from '../../StyledTabs';
import SimpleButton from '../../SimpleButton';
import { GridIcon, ListIcon, TreeIcon } from '../../../constants/icons';
import trialSetsQuery from '../utils/trialSetQuery';
import trialsQuery from '../utils/trialQuery';
import { updateCache } from '../../../apolloGraphql';
import DevicePlanner from '../../DevicePlanner';

const TabPanel = ({ children, value, index, ...other }) => (
  <Typography
    component="div"
    role="tabpanel"
    hidden={value !== index}
    id={`trial-tabpanel-${index}`}
    aria-labelledby={`trial-tab-${index}`}
    style={{ marginBottom: '100px' }}
    {...other}
  >
    <Box>{children}</Box>
  </Typography>
);

class TrialForm extends React.Component {
  state = {
    trial: {
      key: this.props.trial ? this.props.trial.key : uuid(),
      trialSetKey: this.props.match.params.trialSetKey,
      experimentId: this.props.match.params.id,
      id: this.props.trial ? this.props.trial.id : '',
      name: this.props.trial ? this.props.trial.name : '',
      status: this.props.trial && this.props.trial.status ? this.props.trial.status : 'design',
      numberOfDevices: this.props.trial ? this.props.trial.numberOfDevices : 0,
      properties: this.props.trial && this.props.trial.properties ? this.props.trial.properties : [],
      entities: this.props.trial && this.props.trial.entities ? this.props.trial.entities : [],
      deployedEntities: this.props.trial && this.props.trial.deployedEntities ? this.props.trial.deployedEntities : [],
    },
    trialSet: {},
    tabValue: this.props.tabValue || 0,
    selectedViewIndex: 2,
  };

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
        properties = trial.properties;
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

  changeView = (selectedViewIndex) => {
    this.setState({ selectedViewIndex });
  };

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
      trial: {
        ...state.trial,
        properties: update(state.trial.properties, {
          [indexOfProperty]: { val: { $set: value }, key: { $set: propertyKey } },
        }),
      },
    }));
  };

  onEntityPropertyChange = (entityObj, e, propertyKey) => {
    const { trial } = this.state;
    const entitiesField = trial.status === 'deploy' ? 'deployedEntities' : 'entities';
    if (!e.target) return;
    let { value } = e.target;
    if (e.target.type === 'checkbox') value = e.target.checked.toString();
    const indexOfEntity = trial[entitiesField].findIndex(
      entity => entity.key === entityObj.key,
    );
    let indexOfProperty = trial[entitiesField][indexOfEntity].properties.findIndex(
      property => property.key === propertyKey,
    );

    if (indexOfProperty === -1) {
      trial[entitiesField][indexOfEntity].properties.push({ val: value, key: propertyKey });
      indexOfProperty = trial[entitiesField][indexOfEntity].properties.length - 1;
    } else {
      trial[entitiesField][indexOfEntity].properties[indexOfProperty].val = value;
    }
    this.setState({ trial });
  };

  onInputChange = (e, inputName) => {
    const { value } = e.target;

    this.setState(state => ({
      trial: {
        ...state.trial,
        [inputName]: value,
      },
    }));
  };

  closeForm = (deleted) => {
    const { match, history, returnFunc } = this.props;

    if (returnFunc) returnFunc(deleted);
    else {
      history.push(
        `/experiments/${match.params.id}/${TRIAL_SETS_DASH}/${match.params.trialSetKey}/${TRIALS}`,
      );
    }
  };

  submitTrial = async (newTrial, deleted) => {
    const newEntity = newTrial;
    const { match, client, returnFunc } = this.props;
    const { trialSet } = this.state;
    if (deleted) newEntity.state = 'Deleted';
    let property;
    let invalid;
    if (trialSet.properties) {
      trialSet.properties.forEach((p) => {
        property = newEntity.properties.find(ntp => ntp.key === p.key);
        if (!property) return;
        if (p.required && !property.val) {
          invalid = true;
          property.invalid = true;
        } else {
          delete property.invalid;
        }
      });
      if (invalid) {
        this.setState({ tabValue: 0 });
        return;
      }
    }
    await client.mutate({
      mutation: trialMutation(newEntity),
      update: (cache, mutationResult) => {
        updateCache(
          cache,
          mutationResult,
          trialsQuery(match.params.id, match.params.trialSetKey),
          TRIALS,
          TRIAL_MUTATION,
          returnFunc,
        );
      },
    });

    if (!returnFunc) {
      // update number of trials of the trial set
      const updatedTrialSet = { ...trialSet };
      updatedTrialSet.numberOfTrials += 1;
      updatedTrialSet.experimentId = match.params.id;
      updatedTrialSet.properties = updatedTrialSet.properties || [];

      await client.mutate({
        mutation: trialSetMutation(updatedTrialSet),
        update: (cache, mutationResult) => {
          updateCache(
            cache,
            mutationResult,
            trialSetsQuery(match.params.id),
            TRIAL_SETS,
            TRIAL_SET_MUTATION,
            true,
          );
        },
      });
    }

    this.closeForm(deleted);
  };

  // openLocationPopup = () => {
  //   this.setState({ isLocationPopupOpen: true });
  // };

  // closeLocationPopup = () => {
  //   this.setState({ isLocationPopupOpen: false });
  // };

  getValue = (key, defaultValue) => {
    const properties = this.state.trial.properties;
    const p = ((properties && properties.length) ? properties.findIndex(pr => pr.key === key) : -1);
    return (p !== -1 ? properties[p].val : defaultValue);
  }

  getInvalid = (key) => {
    const properties = this.state.trial.properties;
    const p = ((properties && properties.length) ? properties.findIndex(pr => pr.key === key) : -1);
    return (p !== -1 ? properties[p].invalid : false);
  }

  openAddDevicesPanel = () => {
    this.setState({ isDevicesPanelOpen: true });
  }

  closeAddDevicesPanel = () => {
    this.setState({ isDevicesPanelOpen: false });
  }

  addEntity = (entity, type, typeKey, properties) => {
    const { trial } = this.state;
    const entitiesField = trial.status === 'deploy' ? 'deployedEntities' : 'entities';
    this.state.trial[entitiesField] = this.state.trial[entitiesField] || [];
    this.state.trial[entitiesField].push({
      key: entity.key,
      type,
      typeKey,
      properties,
    });
    this.setState({ });
  }

  removeEntity = (key) => {
    const { trial } = this.state;
    const entitiesField = trial.status === 'deploy' ? 'deployedEntities' : 'entities';
    this.state.trial[entitiesField].splice(this.state.trial[entitiesField].findIndex(e => e.key === key), 1);
    this.setState({ });
  }

  render() {
    const { classes, theme, match } = this.props;
    const {
      tabValue,
      selectedViewIndex,
      trialSet,
      trial,
    } = this.state;

    return (
      <>
        <div>
          <ContentHeader
            backButtonHandler={this.closeForm}
            topDescription={trialSet.name}
            withBackButton
            rightDescription={(
              <StatusBadge
                className={classes.statusBadge}
                title={trial.status}
                color={theme.palette[trial.status === 'deploy' ? 'orange' : 'violet'].main}
              />
            )}
            title={trial.name || 'trial name goes here'}
            className={classes.header}
            rightComponent={(
              <StyledTabs
                tabs={[
                  { key: trial.key, label: 'General', id: 'trial-tab-0' },
                  { key: trial.key, label: 'Devices', id: 'trial-tab-1' },
                ]}
                value={tabValue}
                onChange={this.changeTab}
                ariaLabel="trial tabs"
              />
              )}
          />
        </div>
        <TabPanel value={tabValue} index={0}>
          {this.props.trial
            && (
              <Grid item xs={4}>
                <SimpleButton
                  classes={classes}
                  className={classnames(classes.changeStatusButton, classes[`changeStatusButton${trial.status || 'design'}`])}
                  onClick={e => this.onInputChange({ target: { value: trial.status === 'deploy' ? 'design' : 'deploy' } }, 'status')}
                  text={`Change to ${trial.status === 'deploy' ? 'design' : 'deploy'}`}
                  variant="outlined"
                />
              </Grid>
            )
          }
          <CustomInput
            id="trial-name"
            className={classes.property}
            onChange={e => this.onInputChange(e, 'name')}
            label="Name"
            bottomDescription="a short description"
            value={trial.name}
          />
          <CustomInput
            id="trial-id"
            className={classes.property}
            onChange={e => this.onInputChange(e, 'id')}
            label="ID"
            bottomDescription="a short description"
            value={trial.id}
          />
          {trialSet.properties
            ? trialSet.properties.map(property => (
              <CustomInput
                id={`trial-property-${property.key}`}
                className={classes.property}
                key={property.key}
                onChange={e => this.onPropertyChange(e, property.key)}
                label={property.label}
                bottomDescription={property.description}
                value={this.getValue(property.key, property.defaultValue)}
                values={property.value}
                multiple={property.multipleValues}
                type={property.type}
                invalid={this.getInvalid(property.key)}
              />
            ))
            : null}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Grid
            container
            justify="space-between"
            className={classes.devicesPanelHeader}
          >
            <Grid item>
              {/* <IconButton
                disableRipple
                className={
                  selectedViewIndex === 0
                    ? classnames(classes.viewButton, classes.viewButtonSelected)
                    : classes.viewButton
                }
                onClick={() => this.changeView(0)}
              >
                <TreeIcon />
              </IconButton> */}
              {/* <IconButton
                disableRipple
                className={
                  selectedViewIndex === 1
                    ? classnames(classes.viewButton, classes.viewButtonSelected)
                    : classes.viewButton
                }
                onClick={() => this.changeView(1)}
              >
                <ListIcon />
              </IconButton> */}
              <IconButton
                disableRipple
                className={
                  selectedViewIndex === 2
                    ? classnames(classes.viewButton, classes.viewButtonSelected)
                    : classes.viewButton
                }
                onClick={() => this.changeView(2)}
              >
                <GridIcon />
              </IconButton>
              <IconButton
                disableRipple
                className={
                  selectedViewIndex === 3
                    ? classnames(classes.viewButton, classes.viewButtonSelected)
                    : classes.viewButton
                }
                onClick={() => this.changeView(3)}
              >
                <EditLocationIcon className={classes.locationIcon} />
              </IconButton>
            </Grid>
            <Grid item>
              <SimpleButton
                text="Add"
                colorVariant="primary"
                onClick={this.openAddDevicesPanel}
              />
            </Grid>
          </Grid>
          <AddDevicePanel
            isPanelOpen={this.state.isDevicesPanelOpen}
            onClose={this.closeAddDevicesPanel}
            match={match}
            theme={theme}
            addEntity={this.addEntity}
            entities={trial[trial.status === 'deploy' ? 'deployedEntities' : 'entities'].map(e => e.key)}
          />
          <TabPanel value={selectedViewIndex} index={2}>
            <DevicesGrid
              {...this.props}
              trial={trial}
              removeEntity={this.removeEntity}
              onEntityPropertyChange={this.onEntityPropertyChange}
            />
          </TabPanel>
          <TabPanel value={selectedViewIndex} index={3}>
            <DevicePlanner id={match.params.id} />
          </TabPanel>
          {/* <Dialog
            classes={{ root: classes.dialog }}
            fullScreen
            onClose={this.closeLocationPopup}
            aria-labelledby="location-popup-title"
            open={isLocationPopupOpen}
          >
            <DialogTitle id="location-popup-title">
              <DevicePlanner id={match.params.id}/>
            </DialogTitle>
          </Dialog> */}
        </TabPanel>
        <Footer
          cancelButtonHandler={this.closeForm}
          saveButtonHandler={() => this.submitTrial(trial)}
          withDeleteButton={this.props.trial}
          deleteButtonHandler={() => this.submitTrial(trial, true)}
        />
      </>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles, { withTheme: true }),
)(TrialForm);
