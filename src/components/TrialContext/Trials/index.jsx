import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
import moment from 'moment';
import TableContentContainer from '../../TableContentContainer';
import trialsQuery from '../utils/trialQuery';
import { styles } from './styles';
import trialsSubscription from '../utils/trialsSubscription';
import StyledTableCell from '../../StyledTableCell';
import StatusBadge from '../../StatusBadge';
import {
  TRIALS_CONTENT_TYPE,
  TRIAL_SETS_CONTENT_TYPE,
  TRIAL_FORM_CONTENT_TYPE,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import { CloneIcon, GridIcon, PenIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import Graph from '../../../apolloGraphql';
import trialSetsQuery from '../utils/trialSetQuery';

const graphql = new Graph();

class Trials extends React.Component {
  state = {
    trialSet: {},
  };

  componentDidMount() {
    const { experimentId, trialSetKey } = this.props;

    graphql.sendQuery(trialSetsQuery(experimentId)).then((data) => {
      this.setState({
        trialSet: data.trialSets.find(
          trialSet => trialSet.key === trialSetKey,
        ),
      });
    });
  }

  renderTableRow = (trial) => {
    const { classes } = this.props;

    return (
      <React.Fragment key={trial.key}>
        <StyledTableCell align="left">{trial.name}</StyledTableCell>
        <StyledTableCell align="left">
          {trial.numberOfDevices}
        </StyledTableCell>
        {trial.properties.map(property => (
          <StyledTableCell key={property.key} align="left">
            {property.val}
          </StyledTableCell>
        ))}
        <StyledTableCell align="left">
          {moment(trial.created).format('D/M/YYYY')}
        </StyledTableCell>
        <StyledTableCell align="left">
          <StatusBadge color="#BB6BD9" title={trial.status} />
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
          <CustomTooltip title="Open" className={classes.arrowButton} ariaLabel="open">
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
    const { experimentId, changeContentType } = this.props;
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
          backButtonHandler={() => changeContentType(TRIAL_SETS_CONTENT_TYPE)}
          rightDescription={trialSet.id}
          addButtonHandler={() => changeContentType(TRIAL_FORM_CONTENT_TYPE)}
        />
        {trialSet.key ? (
          <TableContentContainer
            subscriptionUpdateField="trialsUpdated"
            dataType={TRIALS_CONTENT_TYPE}
            query={trialsQuery}
            queryArgs={[experimentId, trialSet.key]}
            tableHeadColumns={tableHeadColumns}
            subscription={trialsSubscription}
            renderRow={this.renderTableRow}
          />
        ) : ('Loading...')}
      </>
    );
  }
}

export default withStyles(styles)(Trials);
