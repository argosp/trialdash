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
import { groupBy } from 'lodash';
import deviceTypesQuery from '../../../DeviceContext/utils/deviceTypeQuery';
import devicesQuery from '../../../DeviceContext/Devices/utils/deviceQuery';
import { styles } from '../styles';
import AddDevicePanel from '../../../AddDevicePanel';
import DevicesGrid from './devicesGrid';
import SimpleButton from '../../../SimpleButton';
import { GridIcon, ListIcon, TreeIcon } from '../../../../constants/icons';
import DevicePlanner from '../../../DevicePlanner';
import experimentsQuery from '../../../ExperimentContext/utils/experimentsQuery';

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
    isLoading: true,
  };

  componentWillMount() {
    const { client, match } = this.props;
    client.query({ query: deviceTypesQuery(match.params.id) }).then((data) => {
      const deviceTypes = groupBy(data.data.entitiesTypes, 'key');
      let devices = [];
      client.query({ query: devicesQuery(match.params.id) }).then((devicesData) => {
        devices =  devicesData.data.devices;
        this.setState({
          devices: groupBy(devices, 'key'),
        });
      });
      this.setState({
        deviceTypes,
      });
    });
  }

  componentDidMount() {
    const { client, showFooter } = this.props;
    this.orderEntities();
    client
      .query({ query: experimentsQuery })
      .then(() => this.setState({ isLoading: false }));
    showFooter(false);
  }

  componentDidUpdate(prevProps) {
    const { trial } = this.props;
    const entitiesField = trial.status === 'deploy' ? 'deployedEntities' : 'entities';
    if (prevProps.trial[entitiesField].length !== this.state.length || prevProps.trial.status !== trial.status || this.state.entitiesField !== entitiesField) {
      this.orderEntities();
    }
  }

  orderEntities = () => {
    const { trial } = this.props;
    const entitiesField = trial.status === 'deploy' ? 'deployedEntities' : 'entities';
    this.setState({ update: true, length: trial[entitiesField].length, entities: groupBy(trial[entitiesField], 'typeKey'), entitiesField });
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

  render() {
    const {
      classes,
      theme,
      match,
      trial,
      addEntity,
      removeEntity,
      onEntityPropertyChange,
      updateLocation,
      client,
    } = this.props;
    const {
      selectedViewIndex,
      entities,
      devices,
      deviceTypes,
      update,
      isLoading,
    } = this.state;
    const experiments = !isLoading
      ? client.readQuery({ query: experimentsQuery }).experimentsWithData
      : [];
    const currentExperiment = experiments.find(experiment => experiment.project.id === trial.experimentId);
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
                updateLocation={updateLocation}
                trial={trial}
                entities={trial[trial.status === 'deploy' ? 'deployedEntities' : 'entities']}
                deviceTypes={deviceTypes}
                experimentDataMaps={currentExperiment ? currentExperiment.maps : []}
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
