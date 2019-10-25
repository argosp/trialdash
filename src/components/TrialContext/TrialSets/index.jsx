import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import TableContentContainer from '../../TableContentContainer';
import trialSetsQuery from '../utils/trialSetQuery';
import trialSetsSubscription from '../utils/trialSetsSubscription';
import StyledTableCell from '../../StyledTableCell';
import { styles } from './styles';
import {
  TRIAL_SET_FORM_CONTENT_TYPE,
  TRIAL_SETS_CONTENT_TYPE,
  TRIALS_CONTENT_TYPE,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import { CloneIcon, PenIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';

class TrialSets extends React.Component {
  changeContentType = (contentType) => {
    this.props.changeContentType(contentType);
  };

  openTrialSet = (trialSet) => {
    this.changeContentType(TRIALS_CONTENT_TYPE);
    this.props.selectTrialSet(trialSet);
  };

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
            onClick={() => this.openTrialSet(trialSet)}
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

      return (
        <>
          <ContentHeader
            withSearchInput
            title="Trial sets"
            searchPlaceholder="Search trial sets"
            addButtonText="Add trial set"
            addButtonHandler={() => this.changeContentType(TRIAL_SET_FORM_CONTENT_TYPE)}
          />
          <TableContentContainer
            subscriptionUpdateField="trialSetsUpdated"
            dataType={TRIAL_SETS_CONTENT_TYPE}
            query={trialSetsQuery}
            queryArgs={[this.props.match.params.id]}
            tableHeadColumns={tableHeadColumns}
            subscription={trialSetsSubscription}
            renderRow={this.renderTableRow}
          />
        </>
      );
    }
}

export default withStyles(styles)(TrialSets);
