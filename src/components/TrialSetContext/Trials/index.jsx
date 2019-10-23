import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import TableContentContainer from '../../TableContentContainer';
import trialsQuery from '../../TrialContext/utils/trialQuery';
import { styles } from './styles';
import trialsSubscription from '../../TrialContext/utils/trialsSubscription';
import StyledTableCell from '../../StyledTableCell';
import StatusBadge from '../../StatusBadge';
import {
  TRIALS_CONTENT_TYPE,
  TRIAL_SETS_CONTENT_TYPE,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import { CloneIcon, GridIcon, PenIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';

class TrialSets extends React.Component {
  backToTrialSets = () => {
    this.props.backToTrialSets(TRIAL_SETS_CONTENT_TYPE);
  };

  renderTableRow = (trial) => {
    const { classes } = this.props;

    return (
      <React.Fragment key={trial.id}>
        <StyledTableCell align="left">Trial</StyledTableCell>
        <StyledTableCell align="left">
          {trial.devices ? trial.devices.length : 0}
        </StyledTableCell>
        <StyledTableCell align="left">Release radius</StyledTableCell>
        <StyledTableCell align="left">Release type</StyledTableCell>
        <StyledTableCell align="left">
          <Link to="/" className={classes.locationLink}>
            view location
          </Link>
        </StyledTableCell>
        <StyledTableCell align="left">{trial.begin}</StyledTableCell>
        <StyledTableCell align="left">
          <StatusBadge color="#BB6BD9" title="State" />
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

  render() {
    const { experimentId, trialSet } = this.props;
    const tableHeadColumns = [
      { key: 0, title: '' },
      { key: 1, title: 'devices' },
      { key: 2, title: 'release radius' },
      { key: 3, title: 'release type' },
      { key: 4, title: 'location' },
      { key: 5, title: 'created' },
      { key: 6, title: 'state' },
      { key: 7, title: '' },
    ];

    return (
      <>
        <ContentHeader
          withSearchInput
          title="Trials set"
          searchPlaceholder="Search Trials"
          addButtonText="Add trial"
          withBackButton
          backButtonHandler={this.backToTrialSets}
          rightDescription={trialSet.id}
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

export default withStyles(styles)(TrialSets);
