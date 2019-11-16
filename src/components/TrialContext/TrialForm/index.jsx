import React from 'react';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import FormControl from '@material-ui/core/FormControl';
// import assetsQuery from '../../AssetContext/utils/assetQuery';
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
// import Entity from './entity';
import { styles } from './styles';
import ContentHeader from '../../ContentHeader';
import CustomInput from '../../CustomInput';
import Footer from '../../Footer';
import { TRIAL_SETS, TRIAL_SETS_CONTENT_TYPE, TRIALS_CONTENT_TYPE } from '../../../constants/base';
import StatusBadge from '../../StatusBadge';
import StyledTabs from '../../StyledTabs';
import SimpleButton from '../../SimpleButton';
import { GridIcon, ListIcon, TreeIcon } from '../../../constants/icons';
import trialSetsQuery from '../utils/trialSetQuery';
import trialsQuery from '../utils/trialQuery';
import { updateCache } from '../../../apolloGraphql';

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
  /*  constructor(props) {
    super(props);
    const properties = props.properties || [];
    if (props.trialSet && props.trialSet.properties) {
      props.trialSet.properties.forEach((p) => {
        const property = properties.find(pr => pr.key === p.key);
        if (property) property.type = p.val;
        else properties.push({ key: p.key, val: '', type: p.val });
      });
    }
    this.state = {
      expanded: null,
      experiments: [],
      experimentId: props.experimentId,
      devicesList: [],
      devices: props.devices || [],
      assetsList: [],
      assets: props.assets || [],
      id: props.id || null,
      name: props.name || '',
      notes: props.notes || '',
      begin: props.begin || null,
      end: props.end || null,
      trialSet: props.trialSet,
      properties,
      errors: {},
    };
  }

  componentDidMount() {
    graphql
      .sendQuery(deviceTypesQuery(this.props.experimentId, 'deviceType'))
      .then((data) => {
        const existingDevices = this.state.devices.map(d => d.name);
        //  "nameFormat": The format of the name. {id} will be replaced by the running
        //  number of the deviceType. (start at 1)
        //  (For example, if Number=3 and namFormat="name_{id:02d}", you will get 3 devices with
        //  names: "name_01", "name_02", "name_03")
        const allDevices = this.buildEntities(data.devices);
        this.setState(() => ({
          allDevices,
          devicesList: allDevices.filter(
            d => existingDevices.indexOf(d.name) === -1,
          ),
        }));
      })
      .then(() => {
        setTimeout(() => {
          this.setState(() => ({ timeout: true }));
        }, 5000);
      });

    graphql
      .sendQuery(assetsQuery(this.props.experimentId, 'asset'))
      .then((data) => {
        const existingAssets = this.state.assets.map(d => d.name);
        const allAssets = this.buildEntities(data.assets);
        this.setState(() => ({
          allAssets,
          assetsList: allAssets.filter(
            d => existingAssets.indexOf(d.name) === -1,
          ),
        }));
      })
      .then(() => {
        setTimeout(() => {
          this.setState(() => ({ timeout: true }));
        }, 5000);
      });
  }

  setObj(key, obj) {
    if (key === 'devices') {
      const existingDevices = obj.map(d => d.name);
      // TODO DEVELOPERS PLEASE FIX IT. STATE MUTATION IS TO BE DONE USING setState
      // eslint-disable-next-line
      this.state.devicesList = this.state.allDevices.filter(
        d => existingDevices.indexOf(d.name) === -1,
      );
    }

    if (key === 'assets') {
      const existingAssets = obj.map(d => d.name);
      // TODO DEVELOPERS PLEASE FIX IT. STATE MUTATION IS TO BE DONE USING setState
      // eslint-disable-next-line
      this.state.assetsList = this.state.allAssets.filter(
        d => existingAssets.indexOf(d.name) === -1,
      );
    }

    this.setState({
      [key]: obj,
    });
  }

  removeEntity = (key, id, name) => {
    const obj = this.state[key].filter(
      e => e.entity.id !== id || e.name !== name,
    );
    this.setObj(key, obj);
  };

  handleChangeMultiple = key => (event) => {
    const properties = event.target.value.properties
      && event.target.value.properties.map(p => ({
        key: p.key,
        val: p.val,
        type: p.type,
      }));
    const obj = this.state[key] || [];
    obj.push({
      entity: event.target.value,
      properties,
      name: event.target.value.name,
    });

    this.setObj(key, obj);
  };

  handleChange = key => (event) => {
    this.setState({
      [key]: event.target.value,
    });
  };

  handleChangeProprty = (index, key, entityType, entityIndex) => (event) => {
    // TODO DEVELOPERS PLEASE FIX IT. STATE MUTATION IS TO BE DONE USING setState
    // eslint-disable-next-line
    if (entityType) this.state[entityType][entityIndex].properties[index][key] = event.target.value;
    // TODO DEVELOPERS PLEASE FIX IT. STATE MUTATION IS TO BE DONE USING setState
    // eslint-disable-next-line
    else this.state.properties[index][key] = event.target.value;
    this.setState({});
  };

  submitTrial = () => {
    this.setState({ errors: {} });
    const errors = {};
    let e = false;
    if (!this.state.trialSet || !this.state.trialSet.id) {
      errors.trialSet = true;
      e = true;
    }
    if (e) {
      this.setState({ errors });
      return;
    }
    const newTrial = {
      id: this.state.id,
      name: this.state.name,
      notes: this.state.notes,
      begin: this.state.begin,
      end: this.state.end,
      trialSet: this.state.trialSet.id,
      properties: this.state.properties.map(p => ({ key: p.key, val: p.val })),
      devices: this.state.devices.map(d => ({
        entity: d.entity.id,
        name: d.name,
        properties: d.properties.map(p => ({ key: p.key, val: p.val })),
        type: 'device',
      })),
      assets: this.state.assets.map(d => ({
        entity: d.entity.id,
        name: d.name,
        properties: d.properties
          ? d.properties.map(p => ({ key: p.key, val: p.val }))
          : [],
        type: 'asset',
      })),
      experimentId: this.state.experimentId,
    };

    const self = this;

    graphql
      .sendMutation(trialMutation(newTrial))
      .then((data) => {
        window.alert(`saved trial ${data.addUpdateTrial.id}`);
        self.props.showAll();
      })
      .catch((err) => {
        window.alert(`error: ${err}`);
      });
  };

  buildEntities = (entities) => {
    const list = [];
    let a;
    entities.forEach((e) => {
      for (let i = 0; i < parseInt(e.number, 10); i += 1) {
        a = JSON.parse(JSON.stringify(e));
        a.name = e.name.replace(/{id:(\d*)d}/, (match, number) => (
          '0'.repeat(parseInt(number, 10)) + (i + 1)
        ).slice(
          -parseInt(number, 10),
        ));
        list.push(a);
      }
    });
    return list;
  }; */

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
      `/experiments/${match.params.id}/${TRIAL_SETS}/${match.params.trialSetKey}/${TRIALS_CONTENT_TYPE}`,
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
          TRIALS_CONTENT_TYPE,
          'addUpdateTrial',
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
          TRIAL_SETS_CONTENT_TYPE,
          'addUpdateTrialSet',
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
    const { classes, theme } = this.props;
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
            onClose={this.closeLocationPopup}
            aria-labelledby="location-popup-title"
            open={isLocationPopupOpen}
          >
            <DialogTitle id="location-popup-title">Location</DialogTitle>
          </Dialog>
        </TabPanel>
        <Footer
          cancelButtonHandler={this.closeForm}
          saveButtonHandler={() => this.submitTrial(this.state.trial)}
        />
        {/* <form */}
        {/*  style={classes.container} */}
        {/*  noValidate */}
        {/*  autoComplete="off" */}
        {/* > */}
        {/*  <div> */}
        {/*    <div> */}
        {/*      {this.state.id */}
        {/*        ? `Edit trial of trialSet ${this.state.trialSet.name}` */}
        {/*        : `Add trial to trialSet ${this.state.trialSet.name}`} */}
        {/*    </div> */}
        {/*    <TextField */}
        {/*      style={{ width: '300px', marginTop: '30px' }} */}
        {/*      id="name" */}
        {/*      label="Name" */}
        {/*      className={classes.textField} */}
        {/*      value={this.state.name} */}
        {/*      onChange={this.handleChange('name')} */}
        {/*    /> */}
        {/*    <br /> */}
        {/*    <TextField */}
        {/*      style={{ width: '300px', marginTop: '30px' }} */}
        {/*      id="begin" */}
        {/*      label="Begin" */}
        {/*      type="date" */}
        {/*      className={classes.textField} */}
        {/*      value={this.state.begin} */}
        {/*      onChange={this.handleChange('begin')} */}
        {/*      InputLabelProps={{ */}
        {/*        shrink: true, */}
        {/*      }} */}
        {/*    /> */}
        {/*    <br /> */}
        {/*    <TextField */}
        {/*      style={{ width: '300px', marginTop: '30px' }} */}
        {/*      id="end" */}
        {/*      label="End" */}
        {/*      type="date" */}
        {/*      className={classes.textField} */}
        {/*      value={this.state.end} */}
        {/*      onChange={this.handleChange('end')} */}
        {/*      InputLabelProps={{ */}
        {/*        shrink: true, */}
        {/*      }} */}
        {/*    /> */}
        {/*    <br /> */}
        {/*    <TextField */}
        {/*      style={{ width: '300px', marginTop: '30px' }} */}
        {/*      id="trialSet" */}
        {/*      label="Tial Set" */}
        {/*      type="text" */}
        {/*      readOnly */}
        {/*      className={classes.textField} */}
        {/*      value={this.state.trialSet.name} */}
        {/*    /> */}
        {/*    <br /> */}
        {/*    <TextField */}
        {/*      style={{ width: '300px', marginTop: '30px' }} */}
        {/*      id="notes" */}
        {/*      label="Notes" */}
        {/*      multiline */}
        {/*      rows={5} */}
        {/*      className={classes.textField} */}
        {/*      value={this.state.notes} */}
        {/*      onChange={this.handleChange('notes')} */}
        {/*    /> */}
        {/*    <br /> */}
        {/*    <h3>properties:</h3> */}
        {/*    {this.state.properties.map((p, i) => { */}
        {/*      if (p.type === 'location') { */}
        {/*        return ( */}
        {/*          <LeafLetMap */}
        {/*            onChange={this.handleChangeProprty(i, 'val')} */}
        {/*            location={p.val && p.val !== '' ? p.val.split(',') : [0, 0]} */}
        {/*          /> */}
        {/*        ); */}
        {/*      } */}
        {/*      return ( */}
        {/*        // TODO Add id field into p */}
        {/*        <div key={p.id} style={{ display: 'flex' }}> */}
        {/*          <TextField */}
        {/*            style={{ width: '300px' }} */}
        {/*            type={p.type} */}
        {/*            label={p.key} */}
        {/*            className={classes.textField} */}
        {/*            value={p.val} */}
        {/*            onChange={this.handleChangeProprty(i, 'val')} */}
        {/*            InputLabelProps={{ */}
        {/*              shrink: true, */}
        {/*            }} */}
        {/*          /> */}
        {/*          <br /> */}
        {/*        </div> */}
        {/*      ); */}
        {/*    })} */}
        {/*    <Entity */}
        {/*      entities={this.state.devices} */}
        {/*      entityName="devices" */}
        {/*      removeEntity={this.removeEntity} */}
        {/*      handleChangeMultiple={this.handleChangeMultiple} */}
        {/*      handleChangeProprty={this.handleChangeProprty} */}
        {/*      entitiesList={this.state.devicesList} */}
        {/*    /> */}
        {/*    <Entity */}
        {/*      entities={this.state.assets} */}
        {/*      entityName="assets" */}
        {/*      removeEntity={this.removeEntity} */}
        {/*      handleChangeMultiple={this.handleChangeMultiple} */}
        {/*      handleChangeProprty={this.handleChangeProprty} */}
        {/*      entitiesList={this.state.assetsList} */}
        {/*    /> */}
        {/*    <FormControl */}
        {/*      className={classes.formControl} */}
        {/*      style={{ width: '300px', marginTop: '30px' }} */}
        {/*    > */}
        {/*      <div */}
        {/*        style={{ */}
        {/*          marginTop: '50px', */}
        {/*          textAlign: 'center', */}
        {/*          display: 'flex', */}
        {/*        }} */}
        {/*      > */}
        {/*        <Button */}
        {/*          variant="contained" */}
        {/*          className={classes.button} */}
        {/*          style={{ width: '180px' }} */}
        {/*          onClick={this.submitTrial} */}
        {/*        > */}
        {/*          Submit */}
        {/*        </Button> */}
        {/*        {this.props.cancel && ( */}
        {/*          <Button */}
        {/*            variant="contained" */}
        {/*            className={classes.button} */}
        {/*            style={{ width: '180px' }} */}
        {/*            onClick={this.props.showAll} */}
        {/*          > */}
        {/*            Cancel */}
        {/*          </Button> */}
        {/*        )} */}
        {/*      </div> */}
        {/*    </FormControl> */}
        {/*  </div> */}
        {/* </form> */}
      </>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles, { withTheme: true }),
)(TrialForm);
