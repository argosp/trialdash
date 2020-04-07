import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import trialsQuery from '../utils/trialQuery';
import { styles } from './styles';
import StyledTableCell from '../../StyledTableCell';
import StatusBadge from '../../StatusBadge';
import { TRIAL_SETS_DASH, TRIALS, TRIAL_MUTATION, TRIAL_SETS, TRIAL_SET_MUTATION } from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import { CloneIcon, GridIcon, PenIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import trialSetsQuery from '../utils/trialSetQuery';
import ContentTable from '../../ContentTable';
import TrialForm from '../TrialForm';
import trialMutation from '../TrialForm/utils/trialMutation';
import { updateCache } from '../../../apolloGraphql';
import trialSetMutation from '../utils/trialSetMutation';

class Trials extends React.Component {
  state = {
    trialSet: {},
  };

  componentDidMount() {
    const { match, client } = this.props;

    client
      .query({ query: trialSetsQuery(match.params.id) })
      .then((data) => {
        this.setState({
          trialSet: data.data.trialSets.find(
            trialSet => trialSet.key === match.params.trialSetKey,
          ),
        });
      });
  }

  renderTableRow = (trial) => {
    const { classes, theme } = this.props;

    return (
      <React.Fragment key={trial.key}>
        <StyledTableCell align="left">{trial.name}</StyledTableCell>
        <StyledTableCell align="left">{trial.numberOfDevices}</StyledTableCell>
        {trial.properties.map(property => (
          <StyledTableCell key={property.key} align="left">
            {property.val}
          </StyledTableCell>
        ))}
        <StyledTableCell align="left">
          {moment(trial.created).format('D/M/YYYY')}
        </StyledTableCell>
        <StyledTableCell align="left">
          <StatusBadge color={theme.palette.violet.main} title={trial.status} />
        </StyledTableCell>
        <StyledTableCell align="right">
          <CustomTooltip title="Devices" ariaLabel="devices">
            <GridIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Clone"
            ariaLabel="clone"
            onClick={() => this.clone(trial)}
          >
            <CloneIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Edit"
            ariaLabel="edit"
            onClick={() => this.activateEditMode(trial)}
          >
            <PenIcon />
          </CustomTooltip>
        </StyledTableCell>
      </React.Fragment>
    );
  };

  generateTableColumns = (trialSet) => {
    const columns = [
      { key: uuid(), title: 'trial name' },
      { key: uuid(), title: 'devices' },
    ];

    if (!isEmpty(trialSet) && !isEmpty(trialSet.properties)) {
      trialSet.properties.forEach((property, index) => {
        // the three last columns are static (created, state and buttons)
        if (index === trialSet.properties.length - 1) {
          columns.push(
            { key: uuid(), title: property.label },
            { key: uuid(), title: 'created' },
            { key: uuid(), title: 'state' },
            { key: uuid(), title: '' },
          );

          return;
        }

        columns.push({ key: uuid(), title: property.label });
      });
    }

    return columns;
  };

  clone = async (trial) => {
    const clonedTrial = { ...trial };
    clonedTrial.key = uuid();
    // eslint-disable-next-line prefer-template
    clonedTrial.id = trial.id + ' clone';
    const { match, client } = this.props;
    clonedTrial.experimentId = match.params.id;
    clonedTrial.trialSetKey = match.params.trialSetKey;

    const { trialSet } = this.state;

    await client.mutate({
      mutation: trialMutation(clonedTrial),
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

    this.setState({ update: true });
  };

  setUpdated = () => {
    this.setState({ update: false });
  }

  activateEditMode = (trial) => {
    this.setState({
      isEditModeEnabled: true,
      trial,
    });
  };

  returnFunc = () => {
    this.setState({
      isEditModeEnabled: false,
    });
  }

  render() {
    const { history, match } = this.props;
    const { trialSet } = this.state;
    const tableHeadColumns = this.generateTableColumns(trialSet);

    return (
      <>
        {this.state.isEditModeEnabled
          // eslint-disable-next-line react/jsx-wrap-multilines
          ? <TrialForm
            {...this.props}
            trial={this.state.trial}
            returnFunc={this.returnFunc}
          />
          // eslint-disable-next-line react/jsx-wrap-multilines
          : <>
            <ContentHeader
              withSearchInput
              title="Trials set"
              searchPlaceholder="Search Trials"
              addButtonText="Add trial"
              withBackButton
              backButtonHandler={() => history.push(`/experiments/${match.params.id}/${TRIAL_SETS_DASH}`)}
              rightDescription={trialSet.id}
              addButtonHandler={() => history.push(
                `/experiments/${match.params.id}/${TRIAL_SETS_DASH}/${match.params.trialSetKey}/add-trial`,
              )}
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
        }
      </>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles, { withTheme: true }),
)(Trials);
