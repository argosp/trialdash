/* eslint-disable prefer-destructuring */
import React from 'react';
import { withStyles } from '@material-ui/core';
import update from 'immutability-helper';
import uuid from 'uuid/v4';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
import {
  TRIAL_SETS_DASH,
  TRIAL_SETS,
  TRIALS,
  TRIAL_MUTATION,
  TRIAL_SET_MUTATION,
} from '../../../constants/base';
import { PenIcon } from '../../../constants/icons';
import StatusBadge from '../../StatusBadge';
import StyledTabs from '../../StyledTabs';
import SimpleButton from '../../SimpleButton';
import trialSetsQuery from '../utils/trialSetQuery';
import trialsQuery from '../utils/trialQuery';
import { updateCache } from '../../../apolloGraphql';
import TrialDevices from './TrialDevices';

const COLORS_STATUSES = {
  design: { color: 'violet', level: 'main' },
  deploy: { color: 'orange', level: 'main' },
  execution: { color: 'orange', level: 'main' },
  complete: { color: 'gray', level: 'light' },
};

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
        properties = trial.properties || [];
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
      editableStatus: false,
      anchorMenu: null,
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
        if (!property) {
          property = {
            key: p.key,
            val: this.getValue(p.key, p.defaultValue)
          };
          newEntity.properties.push(property);
        }
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

    this.closeForm(deleted);
  };

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

  setEditableStatus = (editableStatus) => {
    this.setState({ editableStatus });
  }

  handleMenuClick = (event) => {
    this.setState({
      anchorMenu: event.currentTarget,
    });
  };

  handleMenuClose = (anchor) => {
    this.setState({ [anchor]: null });
    this.setEditableStatus(false)
  };

  render() {
    const { classes, theme } = this.props;
    const {
      tabValue,
      trialSet,
      trial,
      editableStatus,
      anchorMenu,
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
                onClick={this.handleMenuClick}
                onMouseEnter={() => this.setEditableStatus(true)}
                onMouseLeave={() => this.setEditableStatus(false)}
                className={classes.statusBadge}
                title={
                  <Grid
                    container
                    wrap="nowrap"
                    justify="space-between"
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
                  { key: trial.key, label: 'General', id: 'trial-tab-0' },
                  { key: trial.key, label: 'Devices', id: 'trial-tab-1' },
                ]}
                value={tabValue}
                onChange={this.changeTab}
                ariaLabel="trial tabs"
              />
              )}
          />
          <Menu
            onMouseEnter={() => this.setEditableStatus(true)}
            onMouseLeave={() => this.setEditableStatus(false)}
            id="statuses-menu"
            classes={{ paper: classes.menu}}
            open={Boolean(anchorMenu)}
            onClose={() => this.handleMenuClose('anchorMenu')}
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
            {['design', 'deploy', 'execution', 'complete'].map((i)=><MenuItem
              key={uuid()}
              classes={{ root: classes.menuItem }}
              onClick={e => this.onInputChange({ target: { value: i } }, 'status')}
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
          <TrialDevices
            trial={trial}
            addEntity={this.addEntity}
            removeEntity={this.removeEntity}
            onEntityPropertyChange={this.onEntityPropertyChange}
          />
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
