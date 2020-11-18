/* eslint-disable prefer-destructuring */
import React from 'react';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import classnames from 'classnames';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import { groupBy, concat } from 'lodash';
import trialsQuery from '../../utils/trialQuery';
import { updateCache } from '../../../../apolloGraphql';
import trialMutationUpdate from '../utils/trialMutationUpdate';
import devicesTrialQuery from '../utils/devicesTrialQuery';
import deviceTypesQuery from '../../../DeviceContext/utils/deviceTypeQuery';
import devicesQuery from '../../../DeviceContext/Devices/utils/deviceQuery';
import { styles } from '../styles';
import AddDevicePanel from '../../../AddDevicePanel';
import DevicesGrid from './devicesGrid';
import SimpleButton from '../../../SimpleButton';
import { GridIcon, ListIcon, TreeIcon } from '../../../../constants/icons';
import DevicePlanner from '../../../DevicePlanner';
import {
  TRIALS,
  TRIAL_MUTATION,
} from '../../../../constants/base';
import dataQuery from '../../../DataContext/utils/dataQuery.js';
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

class TrialDevices extends React.Component {
  state = {
    selectedViewIndex: 3,
    entities: {},
    devices: {},
    deviceTypes: {},
    experimentDataMaps: []
  };

  componentWillMount() {
    const { client, match } = this.props;
    client.query({ query: deviceTypesQuery(match.params.id) }).then((data) => {
      const deviceTypes = groupBy(data.data.deviceTypes, 'key');
      let devices = [];
      Object.keys(deviceTypes).forEach((dt) => {
        client.query({ query: devicesQuery(match.params.id, dt) }).then((devicesData) => {
          const devicesWithType = devicesData.data.devices.map(devItem => {
            devItem.deviceTypeKey = dt;
            return devItem;
          })
          devices = concat(devices, devicesWithType);
          console.log('groupBy(devices, key):', groupBy(devices, 'key'));
          this.setState({
            devices: groupBy(devices, 'key'),
          });
        });
      });
      this.setState({
        deviceTypes,
      });
    });
    this.getExperimentById();
  }

  componentDidMount() {
    this.orderEntities();
  }

  componentDidUpdate(prevProps) {
    const { trial } = this.props;
    const entitiesField = trial.status === 'deploy' ? 'deployedEntities' : 'entities';
    if (prevProps.trial[entitiesField].length !== this.state.length) {
      this.orderEntities();
    }
  }

  orderEntities = () => {
    const { trial } = this.props;
    const entitiesField = trial.status === 'deploy' ? 'deployedEntities' : 'entities';
    this.setState({ update: true, length: trial[entitiesField].length, entities: groupBy(trial[entitiesField], 'typeKey') });
  }

  changeView = (selectedViewIndex) => {
    this.setState({ selectedViewIndex });
    this.props.showFooter(selectedViewIndex !== 3);
  };

  openAddDevicesPanel = () => {
    this.setState({ isDevicesPanelOpen: true });
  }

  closeAddDevicesPanel = () => {
    this.setState({ isDevicesPanelOpen: false });
  }

  setUpdated = () => {
    this.setState({ update: false });
  }

  updateLocation = async (entity) => {
    const newEntity = {};
    const { match, client, trial } = this.props;
    newEntity.key = trial.key;
    newEntity.experimentId = trial.experimentId;
    newEntity.trialSetKey = trial.trialSetKey;
    newEntity[!trial.status || trial.status === 'design' ? 'entities' : 'deployedEntities'] = [entity];

    await client.mutate({
      mutation: trialMutationUpdate(newEntity),
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
  };

  getExperimentById =  async () => {
    const { client, match,trial } = this.props;
    const experimentId =trial.experimentId;
      await client.query({ query: dataQuery(experimentId) }).then(( data) => {
        if(data) this.setState({experimentDataMaps:data.data.experimentData.maps});
   });
  }
  render() {
    const {
      classes,
      theme,
      match,
      trial,
      addEntity,
      removeEntity,
      onEntityPropertyChange,
    } = this.props;
    const {
      selectedViewIndex,
      entities,
      devices,
      deviceTypes,
      update,
    } = this.state;

    return (
      <>
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
          {selectedViewIndex !== 3 && <Grid item>
            <SimpleButton
              text="Add"
              colorVariant="primary"
              onClick={this.openAddDevicesPanel}
            />
          </Grid>}
        </Grid>
        {selectedViewIndex !== 3 && <AddDevicePanel
          isPanelOpen={this.state.isDevicesPanelOpen}
          onClose={this.closeAddDevicesPanel}
          match={match}
          theme={theme}
          addEntity={addEntity}
          entities={trial[trial.status === 'deploy' ? 'deployedEntities' : 'entities'].map(e => e.key)}
        />}
        <TabPanel value={selectedViewIndex} index={2}>
          {selectedViewIndex === 2 &&
            <DevicesGrid
              {...this.props}
              trial={trial}
              removeEntity={removeEntity}
              onEntityPropertyChange={onEntityPropertyChange}
              entities={entities}
              devices={devices}
              deviceTypes={deviceTypes}
              update={update}
              setUpdated={this.setUpdated}
            />
          }
        </TabPanel>
        <TabPanel value={selectedViewIndex} index={3}>
          {
            (selectedViewIndex === 3 && Object.keys(deviceTypes).length) ?
              <DevicePlanner
                updateLocation={this.updateLocation}
                trial={trial}
                entities={trial[trial.status === 'deploy' ? 'deployedEntities' : 'entities'].map(e => e.key)}
                deviceTypes={deviceTypes}
                allDevices={devices}
                experimentDataMaps = {this.state.experimentDataMaps}
              />
              : null
          }
        </TabPanel>
      </>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles, { withTheme: true }),
)(TrialDevices);
