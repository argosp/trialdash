import React from 'react';
import { withStyles } from '@material-ui/core';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import classnames from 'classnames';
import trialsQuery from '../utils/trialQuery';
import { styles } from './styles';
import StyledTableCell from '../../StyledTableCell';
import StatusBadge from '../../StatusBadge';
import {
  TRIAL_SETS_DASH,
  TRIALS,
  TRIAL_MUTATION,
  TRIAL_SETS,
  TRIAL_SET_MUTATION,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import { CloneIcon, GridIcon, PenIcon, BasketIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import trialSetsQuery from '../utils/trialSetQuery';
import ContentTable from '../../ContentTable';
import TrialForm from '../TrialForm';
import trialMutation from '../TrialForm/utils/trialMutation';
import { updateCache } from '../../../apolloGraphql';
import ConfirmDialog from '../../ConfirmDialog';
import { getTrialNameByKey } from '../../../assets/Utils';

class Trials extends React.Component {
  state = {
    trialSet: {},
    open: false,
    confirmOpen: false,
  };

  setConfirmOpen = (open, trial) => {
    if (trial || open) {
      this.setState({ trial });
    }
    this.setState({ confirmOpen: open });
  };

  componentDidMount() {
    const { match, client } = this.props;

    client.query({ query: trialSetsQuery(match.params.id) }).then((data) => {
      this.setState({
        trialSet: data.data.trialSets.find((trialSet) => trialSet.key === match.params.trialSetKey),
      });
    });
  }
  onInputChange = (e) => {
    const { value } = e.target;
    this.setState({ anchorMenu: null });
    this.clone(value, this.state.currentTrial);
  };

  handleMenuClick = (event, trial) => {
    this.setState({
      anchorMenu: event.currentTarget,
      currentTrial: trial,
    });
  };
  //TODO handleMenuChange !state
  handleMenuClose = (anchor) => {
    this.setState({ [anchor]: null });
  };
  displayCloneData = (trial, trialsArray) => {
    return trial.cloneFromTrailKey
      ? `cloned from ${getTrialNameByKey(trial.cloneFromTrailKey, trialsArray)}/${trial.cloneFrom}`
      : `cloned from ${trial.cloneFrom}`; //state will display
  };

  renderTableRow = (trial, index, trialsArray) => {
    const { trialSet, confirmOpen, anchorMenu } = this.state;
    const { classes, theme } = this.props;
    return (
      // should be uniqe id
      <React.Fragment key={trial.created}>
        <StyledTableCell
          align="left"
          className={classes.tableCell}
          onClick={() => this.activateEditMode(trial)}>
          {trial.name}
        </StyledTableCell>
        <StyledTableCell align="left">
          {trial.cloneFrom ? this.displayCloneData(trial, trialsArray) : ''}
        </StyledTableCell>
        <StyledTableCell align="left">{trial.numberOfEntities}</StyledTableCell>
        {trialSet &&
          trialSet.properties &&
          trialSet.properties.map((property) => (
            <StyledTableCell key={property.key} align="left">
              {trial.properties.find((p) => p.key === property.key)
                ? trial.properties.find((p) => p.key === property.key).val
                : ''}
            </StyledTableCell>
          ))}
        <StyledTableCell align="left">{moment(trial.created).format('D/M/YYYY')}</StyledTableCell>
        <StyledTableCell align="left">
          <StatusBadge
            color={theme.palette[trial.status === 'deploy' ? 'orange' : 'violet'].main}
            title={trial.status}
          />
        </StyledTableCell>
        <StyledTableCell align="right" className={classes.actionsCell}>
          <CustomTooltip
            title="Entities"
            ariaLabel="entities"
            onClick={() => this.activateEditMode(trial, true)}>
            <GridIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Clone from"
            ariaLabel="clone"
            onClick={(e) => this.handleMenuClick(e, trial)}>
            <CloneIcon />
          </CustomTooltip>
          {this.state.currentTrial && (
            <Menu
              id="clone-menu"
              classes={{ paper: classes.menu }}
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
              }}>
              {['design', 'deploy'].map((i) => (
                <MenuItem
                  color={
                    theme.palette[this.state.currentTrial.status === 'deploy' ? 'orange' : 'violet']
                      .main
                  }
                  key={uuid()}
                  classes={{ root: classes.menuItem }}
                  onClick={(e) => this.onInputChange({ target: { value: i } })}>
                  <Grid container wrap="nowrap" alignItems="center">
                    <div className={classnames(classes.rect, classes[i])}></div>
                    {i}
                  </Grid>
                </MenuItem>
              ))}
            </Menu>
          )}
          <CustomTooltip title="Edit" ariaLabel="edit" onClick={() => this.activateEditMode(trial)}>
            <PenIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Delete"
            ariaLabel="delete"
            onClick={() => this.setConfirmOpen(true, trial)}>
            <BasketIcon />
          </CustomTooltip>
          <ConfirmDialog
            title={'Delete Trial'}
            open={confirmOpen}
            setOpen={this.setConfirmOpen}
            onConfirm={() => this.deleteTrial(trial)}
            // inputValidation
          >
            Are you sure you want to delete this trial?
          </ConfirmDialog>
        </StyledTableCell>
      </React.Fragment>
    );
  };

  generateTableColumns = (trialSet) => {
    const columns = [
      { key: uuid(), title: 'trial name' },
      { key: uuid(), title: 'clone' },
      { key: uuid(), title: 'entities' },
    ];

    if (!isEmpty(trialSet) && !isEmpty(trialSet.properties)) {
      trialSet.properties.forEach((property, index) => {
        // the three last columns are static (created, state and buttons)
        if (index === trialSet.properties.length - 1) {
          columns.push(
            { key: uuid(), title: property.label },
            { key: uuid(), title: 'created' },
            { key: uuid(), title: 'state' },
            { key: uuid(), title: '' }
          );

          return;
        }

        columns.push({ key: uuid(), title: property.label });
      });
    }

    return columns;
  };

  updateTrialSetNumberOfTrials = (n, cache) => {
    const { match } = this.props;
    const { trialSet } = this.state;
    trialSet.numberOfTrials = n[trialSet.key];
    updateCache(
      cache,
      { data: { [TRIAL_SET_MUTATION]: trialSet } },
      trialSetsQuery(match.params.id),
      TRIAL_SETS,
      TRIAL_SET_MUTATION,
      true
    );
  };

  clone = async (state, trial) => {
    const { match, client } = this.props;
    const clonedTrial = { ...trial };
    clonedTrial.key = uuid();
    clonedTrial.experimentId = match.params.id;
    clonedTrial.trialSetKey = match.params.trialSetKey;
    clonedTrial.cloneFrom = state;
    clonedTrial.cloneFromTrailKey = trial.key;
    clonedTrial.name = `${trial.name} clone`;
    await client.mutate({
      mutation: trialMutation(clonedTrial),
      update: (cache, mutationResult) => {
        if (mutationResult && mutationResult.data.addUpdateTrial.error) {
          return alert(mutationResult.data.addUpdateTrial.error);
        }
        updateCache(
          cache,
          mutationResult,
          trialsQuery(match.params.id, match.params.trialSetKey),
          TRIALS,
          TRIAL_MUTATION,
          false,
          'trialSetKey',
          this.updateTrialSetNumberOfTrials
        );
      },
    });

    this.setState({ update: true });
  };

  setUpdated = () => {
    this.setState({ update: false });
  };

  deleteTrial = async (trial) => {
    // const newEntity = this.state.trial;
    const newEntity = { ...trial };
    newEntity.state = 'Deleted';
    const { match, client } = this.props;
    newEntity.experimentId = match.params.id;
    newEntity.numberOfEntities = newEntity.numberOfEntities || 0;
    newEntity.trialSetKey = match.params.trialSetKey;

    const mutation = trialMutation;
    await client.mutate({
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
          this.updateTrialSetNumberOfTrials
        );
      },
    });

    this.setState({ update: true });
  };

  activateEditMode = (trial, devices) => {
    this.setState({
      isEditModeEnabled: true,
      trial,
      tabValue: devices ? 1 : 0,
    });
  };

  returnFunc = (deleted) => {
    this.setState({
      isEditModeEnabled: false,
      tabValue: 0,
      update: deleted,
    });
  };
  updateTrial = (trial) => {
    this.setState({ trial });
  };

  render() {
    const { history, match } = this.props;
    const { trialSet, tabValue } = this.state;
    const tableHeadColumns = this.generateTableColumns(trialSet);

    return (
      <>
        {this.state.isEditModeEnabled ? (
          // eslint-disable-next-line react/jsx-wrap-multilines
          <TrialForm
            {...this.props}
            trial={this.state.trial}
            returnFunc={this.returnFunc}
            tabValue={tabValue}
            updateTrial={this.updateTrial}
          />
        ) : (
          // eslint-disable-next-line react/jsx-wrap-multilines
          <>
            <ContentHeader
              withSearchInput
              title="Trials set"
              searchPlaceholder="Search Trials"
              withAddButton
              addButtonText="Add trial"
              withBackButton
              backButtonHandler={() =>
                history.push(`/experiments/${match.params.id}/${TRIAL_SETS_DASH}`)
              }
              rightDescription={trialSet ? trialSet.name : ''}
              addButtonHandler={() =>
                (window.location.href = `/experiments/${match.params.id}/${TRIAL_SETS_DASH}/${match.params.trialSetKey}/add-trial`)
              }
            />
            <ContentTable
              contentType={TRIALS}
              query={trialsQuery(match.params.id, match.params.trialSetKey)}
              tableHeadColumns={tableHeadColumns}
              renderRow={this.renderTableRow}
              update={this.state.update}
              setUpdated={this.setUpdated}
            />
          </>
        )}
      </>
    );
  }
}

export default compose(withRouter, withApollo, withStyles(styles, { withTheme: true }))(Trials);
