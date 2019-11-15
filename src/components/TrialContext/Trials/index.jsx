import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import trialsQuery from '../utils/trialQuery';
import { styles } from './styles';
import StyledTableCell from '../../StyledTableCell';
import StatusBadge from '../../StatusBadge';
import { TRIAL_SETS, TRIALS_CONTENT_TYPE } from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import { CloneIcon, GridIcon, PenIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import Graph from '../../../apolloGraphql';
import trialSetsQuery from '../utils/trialSetQuery';
import ContentTable from '../../ContentTable';

const graphql = new Graph();

class Trials extends React.Component {
  state = {
    trialSet: {},
  };

  componentDidMount() {
    const { match } = this.props;

    graphql.sendQuery(trialSetsQuery(match.params.id)).then((data) => {
      this.setState({
        trialSet: data.trialSets.find(
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
          <CustomTooltip title="Clone" ariaLabel="clone">
            <CloneIcon />
          </CustomTooltip>
          <CustomTooltip title="Edit" ariaLabel="edit">
            <PenIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Open"
            className={classes.arrowButton}
            ariaLabel="open"
          >
            <ArrowForwardIosIcon />
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

  render() {
    const { history, match } = this.props;
    const { trialSet } = this.state;
    const tableHeadColumns = this.generateTableColumns(trialSet);

    return (
      <>
        <ContentHeader
          withSearchInput
          title="Trials set"
          searchPlaceholder="Search Trials"
          addButtonText="Add trial"
          withBackButton
          backButtonHandler={() => history.push(`/experiments/${match.params.id}/${TRIAL_SETS}`)}
          rightDescription={trialSet.id}
          addButtonHandler={() => history.push(
            `/experiments/${match.params.id}/${TRIAL_SETS}/${match.params.trialSetKey}/add-trial`,
          )}
        />
        <ContentTable
          contentType={TRIALS_CONTENT_TYPE}
          query={trialsQuery(match.params.id, match.params.trialSetKey)}
          tableHeadColumns={tableHeadColumns}
          renderRow={this.renderTableRow}
        />
      </>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles, { withTheme: true }),
)(Trials);
