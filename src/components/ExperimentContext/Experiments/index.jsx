import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import uuid from 'uuid/v4';
import { withStyles } from '@material-ui/core';
import moment from 'moment';
import Dotdotdot from 'react-dotdotdot';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import ContentTable from '../../ContentTable';
import StyledTableCell from '../../StyledTableCell';
import { styles } from './styles';
import {
  EXPERIMENTS_WITH_DATA,
  TRIAL_SETS_DASH,
  EXPERIMENT_MUTATION,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import experimentsQuery from '../utils/experimentsQuery';
import { CloneIcon, PenIcon, BasketIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import ExperimentForm from '../ExperimentForm';
import experimentMutation from '../ExperimentForm/utils/experimentMutation';
import { updateCache } from '../../../apolloGraphql';
import ConfirmDialog from '../../ConfirmDialog';

class Experiments extends React.Component {
  state = {

  };

  setConfirmOpen = (open, experiment) => {
    if (experiment || open) this.state.experiment = experiment;
    this.setState({ confirmOpen: open });
  }

  renderTableRow = (experiment) => {
    const { classes, client, history } = this.props;
    const { confirmOpen } = this.state;

    return (
      <React.Fragment key={experiment.project.id}>
        <StyledTableCell align="left" className={classes.tableCell} onClick={() => history.push(`/experiments/${experiment.project.id}/${TRIAL_SETS_DASH}`)}>
          <p className={classes.cellTextLine}>{experiment.name}</p>
          <div className={classes.cellTextLine}>
            <Dotdotdot clamp={1}>
              {experiment.description}
            </Dotdotdot>
          </div>
        </StyledTableCell>
        <StyledTableCell align="left" className={classes.tableCell} onClick={() => history.push(`/experiments/${experiment.project.id}/${TRIAL_SETS_DASH}`)}>{moment(experiment.begin).format('D/M/YYYY')}</StyledTableCell>
        <StyledTableCell align="left" className={classes.tableCell} onClick={() => history.push(`/experiments/${experiment.project.id}/${TRIAL_SETS_DASH}`)}>{moment(experiment.end).format('D/M/YYYY')}</StyledTableCell>
        <StyledTableCell align="left" className={classes.tableCell} onClick={() => history.push(`/experiments/${experiment.project.id}/${TRIAL_SETS_DASH}`)}>{experiment.numberOfTrials}</StyledTableCell>
        <StyledTableCell align="right">
          <CustomTooltip
            title="Clone"
            ariaLabel="clone"
            onClick={() => this.clone(experiment)}
          >
            <CloneIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Edit"
            ariaLabel="edit"
            onClick={() => this.activateEditMode(experiment)}
          >
            <PenIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Delete"
            ariaLabel="delete"
            onClick={() => this.setConfirmOpen(true, experiment)}
          >
            <BasketIcon />
          </CustomTooltip>
          <ConfirmDialog
            title="Delete Experiment"
            open={confirmOpen}
            setOpen={this.setConfirmOpen}
            onConfirm={this.deleteExperiment}
            inputValidation
          >
            Are you sure you want to delete this experiment?
          </ConfirmDialog>
          <CustomTooltip
            title="Open"
            className={classes.arrowButtonTooltip}
            ariaLabel="open"
          >
            <Link
              to={() => {
                client.writeData({ data: { headerTabId: 0 } }); // 0 is the Trials tab
                return `/experiments/${experiment.project.id}/${TRIAL_SETS_DASH}`;
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

  deleteExperiment = async () => {
    const newEntity = this.state.experiment;
    newEntity.state = 'Deleted';
    newEntity.projectId = newEntity.project.id;
    const { client } = this.props;

    const mutation = experimentMutation;

    await client
      .mutate({
        mutation: mutation(newEntity),
        update: (cache, mutationResult) => {
          updateCache(
            cache,
            mutationResult,
            experimentsQuery,
            EXPERIMENTS_WITH_DATA,
            EXPERIMENT_MUTATION,
            true,
          );
        },
      });
    this.setState({ update: true, experiment: null });
  };

  activateEditMode = (experiment) => {
    this.setState({
      isEditModeEnabled: true,
      experiment,
    });
  };

  returnFunc = (update) => {
    this.setState({
      isEditModeEnabled: false,
      update,
    });
  }

  clone = async (experiment) => {
    const clonedEXperiment = { ...experiment };
    clonedEXperiment.key = uuid();
    clonedEXperiment.projectId = '';
    const { client } = this.props;
    clonedEXperiment.numberOfTrials = 0;

    await client.mutate({
      mutation: experimentMutation(clonedEXperiment),
      update: (cache, mutationResult) => {
        updateCache(
          cache,
          mutationResult,
          experimentsQuery,
          EXPERIMENTS_WITH_DATA,
          EXPERIMENT_MUTATION,
        );
      },
    });
    this.setState({ update: true });
  };

  setUpdated = () => {
    this.setState({ update: false });
  }

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
    ];

    return (
      <>
        {this.state.isEditModeEnabled
          // eslint-disable-next-line react/jsx-wrap-multilines
          ? <ExperimentForm
            {...this.props}
            experiment={this.state.experiment}
            returnFunc={this.returnFunc}
          />
          // eslint-disable-next-line react/jsx-wrap-multilines
          : <>
            <ContentHeader
              withSearchInput
              title="Experiments"
              searchPlaceholder="Search experiments"
              withAddButton
              addButtonText="Add experiment"
              addButtonHandler={() => this.props.history.push('/add-experiment')}
            />
            <ContentTable
              contentType={EXPERIMENTS_WITH_DATA}
              query={experimentsQuery}
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

export default compose(withApollo, withStyles(styles, { withTheme: true }))(Experiments);
