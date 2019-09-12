import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import StyledTableCell from '../../StyledTableCell';
import ContentTable from '../../ContentTable';
import { styles } from './styles';

class ListOfTrialSets extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <ContentTable
        headerColumns={[
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
        ]}
      >
        {this.props.trialSets.map(trialSet => (
          <React.Fragment key={trialSet.id}>
            <StyledTableCell align="left">Trial set</StyledTableCell>
            <StyledTableCell align="left">9</StyledTableCell>
            <StyledTableCell align="left">{trialSet.notes}</StyledTableCell>
            <StyledTableCell align="right">
              <Tooltip title="Clone trial set">
                <IconButton
                  aria-label="clone trial set"
                >
                  <QueueOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit trial set">
                <IconButton
                  aria-label="edit trial set"
                >
                  <EditOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Open trial set" className={classes.arrowButton}>
                <IconButton
                  aria-label="open trial set"
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </Tooltip>
            </StyledTableCell>
          </React.Fragment>
        ))}
      </ContentTable>
    );
  }
}

export default withStyles(styles)(ListOfTrialSets);
