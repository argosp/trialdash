import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import uuid from 'uuid/v4';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import ContentTable from '../../ContentTable';
import trialSetsQuery from '../utils/trialSetQuery';
import StyledTableCell from '../../StyledTableCell';
import { styles } from './styles';
import {
  TRIAL_SETS_DASH,
  TRIAL_SETS,
  TRIALS,
  TRIAL_SET_MUTATION,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import { CloneIcon, PenIcon, BasketIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import AddSetForm from '../../AddSetForm';
import { updateCache } from '../../../apolloGraphql';
import trialSetMutation from '../utils/trialSetMutation';
import ConfirmDialog from '../../ConfirmDialog';

class TrialSets extends React.Component {
    state = {};

    setConfirmOpen = (open, trialSet) => {
      if (trialSet || open) {
        this.setState({trialSet})
      }
      this.setState({ confirmOpen: open });
    }

    renderTableRow = (trialSet) => {
      const { history, match, classes } = this.props;
      const { confirmOpen } = this.state;

      return (
        <React.Fragment key={trialSet.key}>
          <StyledTableCell className={classes.tableCell} align="left" onClick={() => history.push(`/experiments/${match.params.id}/${TRIAL_SETS_DASH}/${trialSet.key}/${TRIALS}`)}>{trialSet.name}</StyledTableCell>
          <StyledTableCell className={classes.tableCell} align="left" onClick={() => history.push(`/experiments/${match.params.id}/${TRIAL_SETS_DASH}/${trialSet.key}/${TRIALS}`)}>{trialSet.numberOfTrials}</StyledTableCell>
          <StyledTableCell className={classes.tableCell} align="left" onClick={() => history.push(`/experiments/${match.params.id}/${TRIAL_SETS_DASH}/${trialSet.key}/${TRIALS}`)}>{trialSet.description}</StyledTableCell>
          <StyledTableCell align="right">
            <CustomTooltip
              title="Clone"
              ariaLabel="clone"
              onClick={() => this.clone(trialSet)}
            >
              <CloneIcon />
            </CustomTooltip>
            <CustomTooltip
              title="Edit"
              ariaLabel="edit"
              onClick={() => this.activateEditMode(trialSet)}
            >
              <PenIcon />
            </CustomTooltip>
            <CustomTooltip
              title="Delete"
              ariaLabel="delete"
              // onClick={() => this.deleteTrialSet(trialSet)}
              onClick={() => this.setConfirmOpen(true, trialSet)}
            >
              <BasketIcon />
            </CustomTooltip>
            <ConfirmDialog
              title="Delete Trial Set"
              open={confirmOpen}
              setOpen={this.setConfirmOpen}
              onConfirm={() => this.deleteTrialSet(trialSet)}
              // inputValidation
            >
              Are you sure you want to delete this trial set?
            </ConfirmDialog>
            <CustomTooltip
              title="Open"
              className={classes.arrowButton}
              ariaLabel="open"
              onClick={() => history.push(`/experiments/${match.params.id}/${TRIAL_SETS_DASH}/${trialSet.key}/${TRIALS}`)}
            >
              <ArrowForwardIosIcon />
            </CustomTooltip>
          </StyledTableCell>
        </React.Fragment>
      );
    };

    clone = async (trialSet) => {
      const clonedTrialSet = { ...trialSet };
      clonedTrialSet.key = uuid();
      // eslint-disable-next-line prefer-template
      clonedTrialSet.name = trialSet.name + ' clone';
      const { match, client } = this.props;
      clonedTrialSet.experimentId = match.params.id;
      clonedTrialSet.numberOfTrials = trialSet.numberOfTrials;
      clonedTrialSet.cloneTrailKey = trialSet.key

      await client.mutate({
        mutation: trialSetMutation(clonedTrialSet),
        update: (cache, mutationResult) => {
          updateCache(
            cache,
            mutationResult,
            trialSetsQuery(match.params.id),
            TRIAL_SETS,
            TRIAL_SET_MUTATION,
          );
        },
      });

      this.setState({ update: true });
    };

    setUpdated = () => {
      this.setState({ update: false });
    }

    deleteTrialSet = async (trialSet) => {
      const newEntity = trialSet;
      newEntity.state = 'Deleted';
      const { match, client } = this.props;
      newEntity.experimentId = match.params.id;

      const mutation = trialSetMutation;

      await client
        .mutate({
          mutation: mutation(newEntity),
          update: (cache, mutationResult) => {
            updateCache(
              cache,
              mutationResult,
              trialSetsQuery(match.params.id),
              TRIAL_SETS,
              TRIAL_SET_MUTATION,
              true,
            );
          },
        });

      this.setState({ update: true });
    };

    activateEditMode = (trialSet) => {
      this.setState({
        isEditModeEnabled: true,
        trialSet,
      });
    };

    returnFunc = (deleted) => {
      this.setState({
        isEditModeEnabled: false,
        update: deleted,
      });
    }
    updateTrialset = (trialSet) => {
      this.setState({trialSet})
    }

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
          {this.state.isEditModeEnabled
            // eslint-disable-next-line react/jsx-wrap-multilines
            ? <AddSetForm
              {...this.props}
              trialSet={this.state.trialSet}
              formType={TRIAL_SETS_DASH}
              updateTrialset={this.updateTrialset}
              cacheQuery={trialSetsQuery}
              itemsName={TRIAL_SETS}
              mutationName={TRIAL_SET_MUTATION}
              returnFunc={this.returnFunc}
            />
            // eslint-disable-next-line react/jsx-wrap-multilines
            : <>
              <ContentHeader
                withSearchInput
                title="Trial sets"
                searchPlaceholder="Search trial sets"
                withAddButton
                addButtonText="Add trial set"
                addButtonHandler={() => history.push(`/experiments/${match.params.id}/add-trial-set`)}
                withBackButton
                backButtonHandler={() => history.push('/experiments')}
              />
              <ContentTable
                contentType={TRIAL_SETS}
                query={trialSetsQuery(match.params.id)}
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

export default compose(
  withRouter,
  withApollo,
  withStyles(styles),
)(TrialSets);
