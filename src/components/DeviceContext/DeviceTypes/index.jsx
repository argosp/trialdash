import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import uuid from 'uuid/v4';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import ContentTable from '../../ContentTable';
import StyledTableCell from '../../StyledTableCell';
import AddSetForm from '../../AddSetForm';
import { styles } from './styles';
import {
  DEVICE_TYPES_DASH,
  DEVICE_TYPES,
  DEVICES,
  DEVICE_TYPE_MUTATION,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import deviceTypesQuery from '../utils/deviceTypeQuery';
import { CloneIcon, PenIcon, BasketIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import { updateCache } from '../../../apolloGraphql';
import deviceTypeMutation from '../utils/deviceTypeMutation';
import ConfirmDialog from '../../ConfirmDialog';

class DeviceTypes extends React.Component {
    state = {};

    setConfirmOpen = (open, deviceType) => {
      if (deviceType || open) this.state.deviceType = deviceType;
      this.setState({ confirmOpen: open });
    }

    renderTableRow = (deviceType) => {
      const { history, match, classes } = this.props;
      const { confirmOpen } = this.state;

      return (
        <React.Fragment key={deviceType.key}>
          <StyledTableCell className={classes.tableCell} align="left" onClick={() => history.push(`/experiments/${match.params.id}/${DEVICE_TYPES_DASH}/${deviceType.key}/${DEVICES}`)}>{deviceType.name}</StyledTableCell>
          <StyledTableCell className={classes.tableCell} align="left" onClick={() => history.push(`/experiments/${match.params.id}/${DEVICE_TYPES_DASH}/${deviceType.key}/${DEVICES}`)}>{deviceType.properties.length}</StyledTableCell>
          <StyledTableCell className={classes.tableCell} align="left" onClick={() => history.push(`/experiments/${match.params.id}/${DEVICE_TYPES_DASH}/${deviceType.key}/${DEVICES}`)}>{deviceType.numberOfDevices}</StyledTableCell>
          <StyledTableCell align="right">
            <CustomTooltip
              title="Clone"
              ariaLabel="clone"
              onClick={() => this.clone(deviceType)}
            >
              <CloneIcon />
            </CustomTooltip>
            <CustomTooltip
              title="Edit"
              ariaLabel="edit"
              onClick={() => this.activateEditMode(deviceType)}
            >
              <PenIcon />
            </CustomTooltip>
            <CustomTooltip
              title="Delete"
              ariaLabel="delete"
              // onClick={() => this.deleteDeviceType(deviceType)}
              onClick={() => this.setConfirmOpen(true, deviceType)}
            >
              <BasketIcon />
            </CustomTooltip>
            <ConfirmDialog
              title="Delete Device Type"
              open={confirmOpen}
              setOpen={this.setConfirmOpen}
              onConfirm={() => this.deleteDeviceType(deviceType)}
              // inputValidation
            >
              Are you sure you want to delete this device type?
            </ConfirmDialog>
            <CustomTooltip
              title="Open"
              className={classes.arrowButton}
              ariaLabel="open"
              onClick={() => history.push(`/experiments/${match.params.id}/${DEVICE_TYPES_DASH}/${deviceType.key}/${DEVICES}`)}
            >
              <ArrowForwardIosIcon />
            </CustomTooltip>
          </StyledTableCell>
        </React.Fragment>
      );
    };

    clone = async (deviceType) => {
      const clonedDeviceType = { ...deviceType };
      clonedDeviceType.key = uuid();
      // eslint-disable-next-line prefer-template
      clonedDeviceType.name = deviceType.name + ' clone';
      const { match, client } = this.props;
      clonedDeviceType.experimentId = match.params.id;
      clonedDeviceType.numberOfDevices = 0;

      await client.mutate({
        mutation: deviceTypeMutation(clonedDeviceType),
        update: (cache, mutationResult) => {
          updateCache(
            cache,
            mutationResult,
            deviceTypesQuery(match.params.id),
            DEVICE_TYPES,
            DEVICE_TYPE_MUTATION,
          );
        },
      });

      this.setState({ update: true });
    };

    setUpdated = () => {
      this.setState({ update: false });
    }

    deleteDeviceType = async (deviceType) => {
      const newEntity = this.state.deviceType;
      // const newEntity = deviceType;
      newEntity.state = 'Deleted';
      const { match, client } = this.props;
      newEntity.experimentId = match.params.id;

      const mutation = deviceTypeMutation;

      await client
        .mutate({
          mutation: mutation(newEntity),
          update: (cache, mutationResult) => {
            updateCache(
              cache,
              mutationResult,
              deviceTypesQuery(match.params.id),
              DEVICE_TYPES,
              DEVICE_TYPE_MUTATION,
              true,
            );
          },
        });

      this.setState({ update: true });
    };

    activateEditMode = (deviceType) => {
      this.setState({
        isEditModeEnabled: true,
        deviceType,
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
          title: 'Devices',
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
              deviceType={this.state.deviceType}
              formType={DEVICE_TYPES_DASH}
              cacheQuery={deviceTypesQuery}
              itemsName={DEVICE_TYPES}
              mutationName={DEVICE_TYPE_MUTATION}
              returnFunc={this.returnFunc}
            />
            // eslint-disable-next-line react/jsx-wrap-multilines
            : <>
              <ContentHeader
                withSearchInput
                title="Devices types"
                searchPlaceholder="Search Devices types"
                withAddButton
                addButtonText="Add device type"
                addButtonHandler={() => history.push(`/experiments/${match.params.id}/add-device-type`)}
              />
              <ContentTable
                contentType={DEVICE_TYPES}
                query={deviceTypesQuery(match.params.id)}
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
)(DeviceTypes);
