import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import moment from 'moment';
import Dotdotdot from 'react-dotdotdot';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import TableContentContainer from '../../TableContentContainer';
import StyledTableCell from '../../StyledTableCell';
import { styles } from './styles';
import { EXPERIMENTS_WITH_DATA_CONTENT_TYPE, TRIAL_SETS } from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import experimentsQuery from '../utils/experimentsQuery';
import StatusBadge from '../../StatusBadge';
import { CloneIcon, PenIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';

class Experiments extends React.Component {
  renderTableRow = (experiment) => {
    const { classes, theme, client } = this.props;

    return (
      <React.Fragment key={experiment.project.id}>
        <StyledTableCell align="left">
          <p className={classes.cellTextLine}>{experiment.project.name}</p>
          <div className={classes.cellTextLine}>
            <Dotdotdot clamp={1}>
              {experiment.project.description}
            </Dotdotdot>
          </div>
        </StyledTableCell>
        <StyledTableCell align="left">{moment(experiment.begin).format('D/M/YYYY')}</StyledTableCell>
        <StyledTableCell align="left">{moment(experiment.end).format('D/M/YYYY')}</StyledTableCell>
        <StyledTableCell align="left">{experiment.numberOfTrials}</StyledTableCell>
        <StyledTableCell align="left">
          <StatusBadge
            color={theme.palette.violet.main}
            title={experiment.project.status}
          />
        </StyledTableCell>
        <StyledTableCell align="right">
          <CustomTooltip title="Clone" ariaLabel="clone">
            <CloneIcon />
          </CustomTooltip>
          <CustomTooltip title="Edit" ariaLabel="edit">
            <PenIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Open"
            className={classes.arrowButtonTooltip}
            ariaLabel="open"
          >
            <Link
              to={() => {
                client.writeData({ data: { headerTabId: 0 } }); // 0 is the Trials tab
                return `/experiments/${experiment.project.id}/${TRIAL_SETS}`;
              }}
              className={classes.arrowButtonLink}
            >
              <ArrowForwardIosIcon />
            </Link>
          </CustomTooltip>
        </StyledTableCell>
      </React.Fragment>
    );
  };

  render() {
    const tableHeadColumns = [
      { key: 0,
        title: '',
      },
      { key: 1,
        title: 'Start date',
      },
      { key: 2,
        title: 'End date',
      },
      { key: 3,
        title: 'Trials',
      },
      { key: 4,
        title: 'Status',
      },
      { key: 5,
        title: '',
      },
    ];

    return (
      <>
        <ContentHeader
          withSearchInput
          title="Experiments"
          searchPlaceholder="Search experiments"
          addButtonText="Add experiment"
          addButtonHandler={() => this.props.history.push('/add-experiment')}
        />
        <TableContentContainer
          // subscriptionUpdateField="experimentsUpdated"
          dataType={EXPERIMENTS_WITH_DATA_CONTENT_TYPE}
          query={experimentsQuery}
          tableHeadColumns={tableHeadColumns}
          // subscription={}
          renderRow={this.renderTableRow}
        />
      </>
    );
  }
}

export default compose(withApollo, withStyles(styles, { withTheme: true }))(Experiments);
