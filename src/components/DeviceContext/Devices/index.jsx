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
import { CloneMultipleIcon, PenIcon, BasketIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import deviceTypesQuery from '../utils/deviceTypeQuery';
import devicesQuery from './utils/deviceQuery';
import ContentTable from '../../ContentTable';
import DeviceForm from '../DeviceForm';
import deviceMutation from '../DeviceForm/utils/deviceMutation';
import CloneMultiplePanel from '../../CloneMultiplePanel';
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

  openCloneMultiplePanel = (device) => {
    this.setState({ isCloneMultiplePanelOpen: true, device });
  }

  closeCloneMultiplePanel = () => {
    this.setState({ isCloneMultiplePanelOpen: false });
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
          <CustomTooltip
            title="Clone multiple"
            ariaLabel="clone-multiple"
            onClick={() => this.openCloneMultiplePanel(device)}
          >
            <CloneMultipleIcon />
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

  setUpdated = () => {
    this.setState({ update: false });
  }

  setPattern = (number, string, i) => {
    const numberFormat = string.split('{')[1].split('}')[0];
    const startNumber = parseInt(numberFormat, 0);
    const currentNumber = startNumber + i;
    const n = currentNumber.toString();
    return (string.split('{')[0] + (n.length >= numberFormat.length ? n : new Array(numberFormat.length - n.length + 1).join('0') + n) + string.split('}')[1]);
  }

  cloneMultiple = async (number, name, id) => {
    const { match, client } = this.props;

    for (let i = 0; i < number; i += 1) {
      const clonedDevice = { ...this.state.device };
      clonedDevice.key = uuid();
      clonedDevice.id = this.setPattern(number, id, i);
      clonedDevice.name = this.setPattern(number, name, i);
      clonedDevice.experimentId = match.params.id;
      clonedDevice.deviceTypeKey = match.params.deviceTypeKey;

      await client.mutate({
        mutation: deviceMutation(clonedDevice),
        update: (cache, mutationResult) => {
          updateCache(
            cache,
            mutationResult,
            devicesQuery(match.params.id, match.params.deviceTypeKey),
            DEVICES,
            DEVICE_MUTATION,
          );
        },
      });
    }

    this.setState({ update: true, isCloneMultiplePanelOpen: false });
  };


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
    const { deviceType, isCloneMultiplePanelOpen, device } = this.state;
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
              addButtonHandler={() => history.push(`/experiments/${match.params.id}/${DEVICE_TYPES_DASH}/${match.params.deviceTypeKey}/add-device`)}
            />
            <CloneMultiplePanel
              device={device}
              isPanelOpen={isCloneMultiplePanelOpen}
              onClose={this.closeCloneMultiplePanel}
              cloneMultiple={this.cloneMultiple}
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
