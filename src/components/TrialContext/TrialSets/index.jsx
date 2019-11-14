import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import TableContentContainer from '../../TableContentContainer';
import trialSetsQuery from '../utils/trialSetQuery';
import trialSetsSubscription from '../utils/trialSetsSubscription';
import StyledTableCell from '../../StyledTableCell';
import { styles } from './styles';
import {
  TRIAL_SETS_CONTENT_TYPE,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import { CloneIcon, PenIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';

class TrialSets extends React.Component {
    renderTableRow = trialSet => (
      <React.Fragment key={trialSet.key}>
        <StyledTableCell align="left">{trialSet.name}</StyledTableCell>
        <StyledTableCell align="left">{trialSet.numberOfTrials}</StyledTableCell>
        <StyledTableCell align="left">{trialSet.description}</StyledTableCell>
        <StyledTableCell align="right">
          <CustomTooltip title="Clone" ariaLabel="clone">
            <CloneIcon />
          </CustomTooltip>
          <CustomTooltip title="Edit" ariaLabel="edit">
            <PenIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Open"
            className={this.props.classes.arrowButton}
            ariaLabel="open"
            // onClick={() => this.openTrialSet(trialSet)}
          >
            <ArrowForwardIosIcon />
          </CustomTooltip>
        </StyledTableCell>
      </React.Fragment>
    );

    render() {
      const tableHeadColumns = [
        { key: 0,
          title: '',
        },
        { key: 1,
          title: 'Trials',
        },
        { key: 2,
          title: 'Description',
        },
        { key: 3,
          title: '',
        },
      ];
      const { history, match } = this.props;

      return (
        <>
          <ContentHeader
            withSearchInput
            title="Trial sets"
            searchPlaceholder="Search trial sets"
            addButtonText="Add trial set"
            addButtonHandler={() => history.push(`/experiments/${match.params.id}/add-trial-set`)}
          />
          <TableContentContainer
            subscriptionUpdateField="trialSetsUpdated"
            dataType={TRIAL_SETS_CONTENT_TYPE}
            query={trialSetsQuery}
            queryArgs={[match.params.id]}
            tableHeadColumns={tableHeadColumns}
            subscription={trialSetsSubscription}
            renderRow={this.renderTableRow}
          />
        </>
      );
    }
}

export default compose(
  withRouter,
  withStyles(styles),
)(TrialSets);
