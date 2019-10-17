import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import moment from 'moment';
import Dotdotdot from 'react-dotdotdot';
import { ReactComponent as CloneIcon } from '../../../assets/icons/clone.svg';
import TableContentContainer from '../../TableContentContainer';
import StyledTableCell from '../../StyledTableCell';
import { styles } from './styles';
import {
  EXPERIMENTS_CONTENT_TYPE,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import { ReactComponent as PenIcon } from '../../../assets/icons/pen.svg';
import experimentsQuery from '../utils/experimentsQuery';
import StatusBadge from '../../StatusBadge';

class Experiments extends React.Component {
  openExperiment = (experiment) => {
    const { openExperiment, changeContentId } = this.props;
    openExperiment(experiment);
    changeContentId(0);
  };

  renderTableRow = experiment => (
    <React.Fragment key={experiment.id}>
      <StyledTableCell align="left">
        <p className={this.props.classes.cellTextLine}>{experiment.name}</p>
        <p className={this.props.classes.cellTextLine}>
          <Dotdotdot clamp={1}>
            {experiment.description}
          </Dotdotdot>
        </p>
      </StyledTableCell>
      <StyledTableCell align="left">{moment(experiment.begin).format('D/M/YYYY')}</StyledTableCell>
      <StyledTableCell align="left">{moment(experiment.end).format('D/M/YYYY')}</StyledTableCell>
      <StyledTableCell align="left">{experiment.numberOfTrials}</StyledTableCell>
      <StyledTableCell align="left">
        <StatusBadge color="#27AE60" title={experiment.status} />
      </StyledTableCell>
      <StyledTableCell align="right">
        <Tooltip title="Clone experiment">
          <IconButton
            aria-label="clone experiment"
          >
            <SvgIcon component={CloneIcon} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit experiment">
          <IconButton
            aria-label="edit experiment"
          >
            <SvgIcon component={PenIcon} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Open experiment" className={this.props.classes.arrowButton}>
          <IconButton
            aria-label="open experiment"
            onClick={() => this.openExperiment(experiment)}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Tooltip>
      </StyledTableCell>
    </React.Fragment>
  );

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
          // addButtonHandler={}
        />
        <TableContentContainer
          // subscriptionUpdateField="experimentsUpdated"
          dataType={EXPERIMENTS_CONTENT_TYPE}
          query={experimentsQuery}
          tableHeadColumns={tableHeadColumns}
          // subscription={}
          renderRow={this.renderTableRow}
        />
      </>
    );
  }
}

export default withStyles(styles)(Experiments);
