import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import GridOnOutlinedIcon from '@material-ui/icons/GridOnOutlined';
import TableContentContainer from '../../TableContentContainer';
import trialsQuery from '../../TrialContext/utils/trialQuery';
import { styles } from './styles';
import trialsSubscription from '../../TrialContext/utils/trialsSubscription';
import StyledTableCell from '../../StyledTableCell';
import {
  TRIALS_CONTENT_TYPE,
  TRIAL_SETS_CONTENT_TYPE,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';

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
          <div className={classes.stateWrapper}>State</div>
        </StyledTableCell>
        <StyledTableCell align="right">
          <Tooltip title="">
            <IconButton aria-label="">
              <GridOnOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clone trial">
            <IconButton aria-label="clone trial">
              <QueueOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit trial">
            <IconButton aria-label="edit trial">
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open trial" className={classes.arrowButton}>
            <IconButton aria-label="open trial">
              <ArrowForwardIosIcon />
            </IconButton>
          </Tooltip>
        </StyledTableCell>
      </React.Fragment>
    );
  };

  render() {
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
          title="Trials set"
          searchPlaceholder="Search Trials"
          addButtonText="Add trial"
          withBackButton
          backButtonHandler={this.backToTrialSets}
          rightDescription="Short description"
        />
        <TableContentContainer
          subscriptionUpdateField="trialsUpdated"
          dataType={TRIALS_CONTENT_TYPE}
          query={trialsQuery}
          experimentId={this.props.experimentId}
          tableHeadColumns={tableHeadColumns}
          subscription={trialsSubscription}
          renderRow={this.renderTableRow}
        />
      </>
    );
  }
}

export default withStyles(styles)(TrialSets);
