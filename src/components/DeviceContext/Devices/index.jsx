import React from 'react';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import ContentHeader from '../../ContentHeader';
import {
  DEVICE_TYPES_DASH,
  DEVICES,
  DEVICE_MUTATION,
  DEVICE_TYPES,
  DEVICE_TYPE_MUTATION,
} from '../../../constants/base';
import StyledTableCell from '../../StyledTableCell';
import { CloneIcon, PenIcon, BasketIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import deviceTypesQuery from '../utils/deviceTypeQuery';
import devicesQuery from './utils/deviceQuery';
import ContentTable from '../../ContentTable';
import DeviceForm from '../DeviceForm';
import deviceMutation from '../DeviceForm/utils/deviceMutation';
import { updateCache } from '../../../apolloGraphql';
import deviceTypeMutation from '../utils/deviceTypeMutation';

class Devices extends React.Component {
  state = {
    deviceType: {},
  };

  componentDidMount() {
    const { match, client } = this.props;

    client
      .query({ query: deviceTypesQuery(match.params.id) })
      .then((data) => {
        this.setState({
          deviceType: data.data.deviceTypes.find(
            deviceType => deviceType.key === match.params.deviceTypeKey,
          ),
        });
      });
  }

  renderTableRow = (device) => {
    const { deviceType } = this.state;
    return (
      <React.Fragment key={device.key}>
        <StyledTableCell align="left">{device.name}</StyledTableCell>
        <StyledTableCell align="left">{device.id}</StyledTableCell>
        {deviceType && deviceType.properties && deviceType.properties.filter(p => !p.trialField).map(property => (
          <StyledTableCell key={property.key} align="left">
            {device.properties.find(p => p.key === property.key) ? device.properties.find(p => p.key === property.key).val : ''}
          </StyledTableCell>
        ))}
        <StyledTableCell align="right">
          <CustomTooltip title="Clone" ariaLabel="clone">
            <CloneIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Edit"
            ariaLabel="edit"
            onClick={() => this.activateEditMode(device)}
          >
            <PenIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Delete"
            ariaLabel="delete"
            onClick={() => this.deleteDevice(device)}
          >
            <BasketIcon />
          </CustomTooltip>
        </StyledTableCell>
      </React.Fragment>
    );
  };

  generateTableColumns = (deviceType) => {
    const columns = [
      { key: uuid(), title: 'device name' },
      { key: uuid(), title: 'id' },
    ];

    if (!isEmpty(deviceType) && !isEmpty(deviceType.properties)) {
      deviceType.properties.filter(property => !property.trialField).forEach((property) => {
        columns.push({ key: uuid(), title: property.label });
      });
      columns.push({ key: uuid(), title: '' });
    }

    return columns;
  };

  // update number of devices of the device type
  updateNumberOfDevices = async (operation) => {

    const { deviceType } = this.state;
    const updatedDeviceType = { ...deviceType };
    if (operation === 'add') {
      updatedDeviceType.numberOfDevices += 1;
    } else {
      updatedDeviceType.numberOfDevices -= 1;
    }
    const { match, client } = this.props;
    updatedDeviceType.experimentId = match.params.id;

    await client.mutate({
      mutation: deviceTypeMutation(updatedDeviceType),
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
  }

  setUpdated = () => {
    this.setState({ update: false });
  }

  deleteDevice = async (device) => {
    const newEntity = { ...device };
    newEntity.state = 'Deleted';
    const { match, client } = this.props;
    newEntity.experimentId = match.params.id;
    newEntity.deviceTypeKey = match.params.deviceTypeKey;

    const mutation = deviceMutation;

    await client
      .mutate({
        mutation: mutation(newEntity),
        update: (cache, mutationResult) => {
          updateCache(
            cache,
            mutationResult,
            devicesQuery(match.params.id, match.params.deviceTypeKey),
            DEVICES,
            DEVICE_MUTATION,
            true,
          );
        },
      });
    // this.updateNumberOfTrials('remove');
    this.setState({ update: true });
  };

  activateEditMode = (device) => {
    this.setState({
      isEditModeEnabled: true,
      device,
    });
  };

  returnFunc = (deleted) => {
    this.setState({
      isEditModeEnabled: false,
      update: deleted,
    });
  }

  render() {
    const { history, match } = this.props;
    const { deviceType } = this.state;
    const tableHeadColumns = this.generateTableColumns(deviceType);

    return (
      <>
        {this.state.isEditModeEnabled
          // eslint-disable-next-line react/jsx-wrap-multilines
          ? <DeviceForm
            {...this.props}
            device={this.state.device}
            returnFunc={this.returnFunc}
          />
          // eslint-disable-next-line react/jsx-wrap-multilines
          : <>
            <ContentHeader
              withSearchInput
              title={deviceType.name}
              searchPlaceholder="Search Devices"
              addButtonText="Add device"
              withBackButton
              backButtonHandler={() => history.push(`/experiments/${match.params.id}/${DEVICE_TYPES_DASH}`)}
              rightDescription={deviceType.id}
              addButtonHandler={() => history.push(
                `/experiments/${match.params.id}/${DEVICE_TYPES_DASH}/${match.params.deviceTypeKey}/add-device`,
              )}
            />
            <ContentTable
              contentType={DEVICES}
              query={devicesQuery(match.params.id, match.params.deviceTypeKey)}
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
  withApollo,
  withRouter,
)(Devices);
