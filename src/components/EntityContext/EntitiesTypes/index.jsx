import React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import uuid from 'uuid/v4';
import { withStyles } from '@mui/styles';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import ContentTable from '../../ContentTable';
import StyledTableCell from '../../StyledTableCell';
import AddSetForm from '../../AddSetForm';
import { styles } from './styles';
import {
  ENTITIES_TYPES_DASH,
  ENTITIES_TYPES,
  ENTITIES,
  ENTITIES_TYPE_MUTATION,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import entitiesTypesQuery from '../utils/entityTypeQuery';
import { CloneIcon, PenIcon, BasketIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import { updateCache } from '../../../apolloGraphql';
import entitiesTypeMutation from '../utils/entitiesTypeMutation';
import ConfirmDialog from '../../ConfirmDialog';

class EntitiesTypes extends React.Component {
    state = {};

    setConfirmOpen = (open, entitiesType) => {
      if (entitiesType || open) {
        this.setState({entitiesType})
      }
      this.setState({ confirmOpen: open });
    }

    renderTableRow = (entitiesType) => {
      const { history, match, classes } = this.props;
      const { confirmOpen } = this.state;

      return (
        <React.Fragment key={entitiesType.key}>
          <StyledTableCell className={classes.tableCell} align="left" onClick={() => history.push(`/experiments/${match.params.id}/${ENTITIES_TYPES_DASH}/${entitiesType.key}/${ENTITIES}`)}>{entitiesType.name}</StyledTableCell>
          <StyledTableCell className={classes.tableCell} align="left" onClick={() => history.push(`/experiments/${match.params.id}/${ENTITIES_TYPES_DASH}/${entitiesType.key}/${ENTITIES}`)}>{entitiesType.properties.length}</StyledTableCell>
          <StyledTableCell className={classes.tableCell} align="left" onClick={() => history.push(`/experiments/${match.params.id}/${ENTITIES_TYPES_DASH}/${entitiesType.key}/${ENTITIES}`)}>{entitiesType.numberOfEntities}</StyledTableCell>
          <StyledTableCell align="right">
            <CustomTooltip
              title="Clone"
              ariaLabel="clone"
              onClick={() => this.clone(entitiesType)}
            >
              <CloneIcon />
            </CustomTooltip>
            <CustomTooltip
              title="Edit"
              ariaLabel="edit"
              onClick={() => this.activateEditMode(entitiesType)}
            >
              <PenIcon />
            </CustomTooltip>
            <CustomTooltip
              title="Delete"
              ariaLabel="delete"
              // onClick={() => this.deleteEntitiesType(entitiesType)}
              onClick={() => this.setConfirmOpen(true, entitiesType)}
            >
              <BasketIcon />
            </CustomTooltip>
            <ConfirmDialog
              title="Delete Entities Type"
              open={confirmOpen}
              setOpen={this.setConfirmOpen}
              onConfirm={() => this.deleteEntitiesType(entitiesType)}
              // inputValidation
            >
              Are you sure you want to delete this entities type?
            </ConfirmDialog>
            <CustomTooltip
              title="Open"
              className={classes.arrowButton}
              ariaLabel="open"
              onClick={() => history.push(`/experiments/${match.params.id}/${ENTITIES_TYPES_DASH}/${entitiesType.key}/${ENTITIES}`)}
            >
              <ArrowForwardIosIcon />
            </CustomTooltip>
          </StyledTableCell>
        </React.Fragment>
      );
    };

    clone = async (entitiesType) => {
      const clonedEntitiesType = { ...entitiesType };
      clonedEntitiesType.key = uuid();
      // eslint-disable-next-line prefer-template
      clonedEntitiesType.name = entitiesType.name + ' clone';
      const { match, client } = this.props;
      clonedEntitiesType.experimentId = match.params.id;
      clonedEntitiesType.numberOfEntities = 0;

      await client.mutate({
        mutation: entitiesTypeMutation(clonedEntitiesType),
        update: (cache, mutationResult) => {
          updateCache(
            cache,
            mutationResult,
            entitiesTypesQuery(match.params.id),
            ENTITIES_TYPES,
            ENTITIES_TYPE_MUTATION,
          );
        },
      });

      this.setState({ update: true });
    };

    setUpdated = () => {
      this.setState({ update: false });
    }

    deleteEntitiesType = async (entitiesType) => {
      const newEntity = this.state.entitiesType;
      // const newEntity = entitiesType;
      newEntity.state = 'Deleted';
      const { match, client } = this.props;
      newEntity.experimentId = match.params.id;

      const mutation = entitiesTypeMutation;

      await client
        .mutate({
          mutation: mutation(newEntity),
          update: (cache, mutationResult) => {
            updateCache(
              cache,
              mutationResult,
              entitiesTypesQuery(match.params.id),
              ENTITIES_TYPES,
              ENTITIES_TYPE_MUTATION,
              true,
            );
          },
        });

      this.setState({ update: true });
    };

    activateEditMode = (entitiesType) => {
      this.setState({
        isEditModeEnabled: true,
        entitiesType,
      });
    };

    returnFunc = (deleted) => {
      this.setState({
        isEditModeEnabled: false,
        update: deleted,
      });
    }

    render() {
      const tableHeadColumns = [
        { key: 0,
          title: '',
        },
        { key: 1,
          title: 'Fields',
        },
        { key: 2,
          title: 'Entities',
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
              entitiesType={this.state.entitiesType}
              formType={ENTITIES_TYPES_DASH}
              cacheQuery={entitiesTypesQuery}
              itemsName={ENTITIES_TYPES}
              mutationName={ENTITIES_TYPE_MUTATION}
              returnFunc={this.returnFunc}
            />
            // eslint-disable-next-line react/jsx-wrap-multilines
            : <>
              <ContentHeader
                withSearchInput
                title="Entities types"
                searchPlaceholder="Search Entities types"
                withAddButton
                addButtonText="Add entities type"
                addButtonHandler={() => history.push(`/experiments/${match.params.id}/add-entities-type`)}
              />
              <ContentTable
                contentType={ENTITIES_TYPES}
                query={entitiesTypesQuery(match.params.id)}
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
)(EntitiesTypes);
