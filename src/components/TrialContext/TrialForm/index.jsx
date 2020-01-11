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
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import trialMutation from './utils/trialMutation';
import trialSetMutation from '../utils/trialSetMutation';
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
    {...other}
  >
    <Box>{children}</Box>
  </Typography>
);

class TrialForm extends React.Component {
  state = {
    trial: {
      trialSetKey: this.props.match.params.trialSetKey,
      experimentId: this.props.match.params.id,
      id: '',
      name: '',
      numberOfDevices: 0,
      properties: [],
    },
    trialSet: {},
    tabValue: 0,
    selectedViewIndex: 0,
    isLocationPopupOpen: false,
  };

  componentDidMount() {
    const { client, match } = this.props;

    client.query({ query: trialSetsQuery(match.params.id) }).then((data) => {
      const trialSet = data.data.trialSets.find(
        item => item.key === match.params.trialSetKey,
      );
      const properties = [];

      trialSet.properties.forEach(property => properties.push({ key: property.key, val: '' }));

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
    const { value } = e.target;
    const indexOfProperty = this.state.trial.properties.findIndex(
      property => property.key === propertyKey,
    );

    this.setState(state => ({
      trial: {
        ...state.trial,
        properties: update(state.trial.properties, {
          [indexOfProperty]: { val: { $set: value } },
        }),
      },
    }));
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

  closeForm = () => {
    const { match, history } = this.props;

    history.push(
      `/experiments/${match.params.id}/${TRIAL_SETS_DASH}/${match.params.trialSetKey}/${TRIALS}`,
    );
  };

  submitTrial = async (newTrial) => {
    const { match, client } = this.props;
    const { trialSet } = this.state;

    await client.mutate({
      mutation: trialMutation(newTrial),
      update: (cache, mutationResult) => {
        updateCache(
          cache,
          mutationResult,
          trialsQuery(match.params.id, match.params.trialSetKey),
          TRIALS,
          TRIAL_MUTATION,
        );
      },
    });

    // update number of trials of the trial set
    const updatedTrialSet = { ...trialSet };
    updatedTrialSet.numberOfTrials += 1;
    updatedTrialSet.experimentId = match.params.id;

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

    this.closeForm();
  };

  openLocationPopup = () => {
    this.setState({ isLocationPopupOpen: true });
  };

  closeLocationPopup = () => {
    this.setState({ isLocationPopupOpen: false });
  };

  render() {
    const { classes, theme, match } = this.props;
    const {
      tabValue,
      selectedViewIndex,
      isLocationPopupOpen,
      trialSet,
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
                title="New"
                color={theme.palette.violet.main}
              />
            )}
            title="trial name goes here"
            className={classes.header}
            rightComponent={(
              <StyledTabs
                tabs={[
                  { key: uuid(), label: 'General', id: 'trial-tab-0' },
                  { key: uuid(), label: 'Devices', id: 'trial-tab-1' },
                ]}
                value={tabValue}
                onChange={this.changeTab}
                ariaLabel="trial tabs"
              />
              )}
          />
        </div>
        <TabPanel value={tabValue} index={0}>
          <CustomInput
            id="trial-name"
            className={classes.property}
            onChange={e => this.onInputChange(e, 'name')}
            label="Name"
            bottomDescription="a short description"
          />
          <CustomInput
            id="trial-id"
            className={classes.property}
            onChange={e => this.onInputChange(e, 'id')}
            label="ID"
            bottomDescription="a short description"
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
              <IconButton
                disableRipple
                className={
                  selectedViewIndex === 0
                    ? classnames(classes.viewButton, classes.viewButtonSelected)
                    : classes.viewButton
                }
                onClick={() => this.changeView(0)}
              >
                <TreeIcon />
              </IconButton>
              <IconButton
                disableRipple
                className={
                  selectedViewIndex === 1
                    ? classnames(classes.viewButton, classes.viewButtonSelected)
                    : classes.viewButton
                }
                onClick={() => this.changeView(1)}
              >
                <ListIcon />
              </IconButton>
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
                className={classes.viewButton}
                onClick={this.openLocationPopup}
              >
                <EditLocationIcon className={classes.locationIcon} />
              </IconButton>
            </Grid>
            <Grid item>
              <SimpleButton text="Add" colorVariant="primary" />
            </Grid>
          </Grid>
          <Dialog
            fullScreen
            onClose={this.closeLocationPopup}
            aria-labelledby="location-popup-title"
            open={isLocationPopupOpen}
          >
            <DialogTitle id="location-popup-title">
              <DevicePlanner id={match.params.id}/>
            </DialogTitle>
          </Dialog>
        </TabPanel>
        <Footer
          cancelButtonHandler={this.closeForm}
          saveButtonHandler={() => this.submitTrial(this.state.trial)}
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
