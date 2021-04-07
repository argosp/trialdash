import React from 'react';
import uuid from 'uuid/v4';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core';
import { isEmpty } from 'lodash';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import Checkbox from '@material-ui/core/Checkbox';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { styles } from './styles';
import ContentHeader from '../../ContentHeader';
import {
  DEVICE_TYPES_DASH,
  DEVICES,
  DEVICE_MUTATION,
} from '../../../constants/base';
import StyledTableCell from '../../StyledTableCell';
import { CloneMultipleIcon, PenIcon, CheckBoxOutlineBlankIcon, CheckBoxOutlinedIcon, IndeterminateCheckBoxOutlinedIcon, MoreActionsIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import deviceTypesQuery from '../utils/deviceTypeQuery';
import devicesQuery from './utils/deviceQuery';
import ContentTable from '../../ContentTable';
import DeviceForm from '../DeviceForm';
import deviceMutation from '../DeviceForm/utils/deviceMutation';
import deviceMutationUpdate from '../DeviceForm/utils/deviceMutationUpdate';
import CloneMultiplePanel from '../../CloneMultiplePanel';
import { updateCache } from '../../../apolloGraphql';
import ConfirmDialog from '../../ConfirmDialog';

class Devices extends React.Component {
  state = {
    deviceType: {},
    selected: [],
    data: [],
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

  setConfirmOpen = (open, device) => {
    if (device || open) this.state.device = device;
    this.setState({ confirmOpen: open });
  }

  setConfirmMultipleOpen = (open) => {
    this.setState({ confirmMultipleOpen: open });
  }

  selectRow = (key) => {
    const { selected } = this.state;
    if (selected.indexOf(key) !== -1) selected.splice(selected.indexOf(key), 1);
    else selected.push(key);
    this.setState({ selected });
  }

  handleMenuClick = (event, device) => {
    this.setState({
      anchorMenu: event.currentTarget,
      device
    });
  };

  handleMenuClose = (anchor) => {
    this.setState({ [anchor]: null });
  };

  renderTableRow = (device) => {
    const { classes } = this.props;
    const { deviceType, confirmOpen, selected, anchorMenu } = this.state;
    const selectedDT = selected.indexOf(device.key) !== -1;
    return (
      <React.Fragment key={device.key}>
        <StyledTableCell className={classnames(classes.tableCell, (selectedDT ? classes.selectedRow : ''))} align="left">
          <Checkbox
            checked={selectedDT}
            onClick={() => this.selectRow(device.key)}
            className={classes.checkboxWrapper}
            icon={
              <CheckBoxOutlineBlankIcon />
            }
            checkedIcon={
              <CheckBoxOutlinedIcon />
            }
            disableRipple
          />{device.name}
        </StyledTableCell>
        <StyledTableCell className={classnames(classes.tableCell, (selectedDT ? classes.selectedRow : ''))} align="left">{device.id}</StyledTableCell>
        {deviceType && deviceType.properties && deviceType.properties.filter(p => !p.trialField).map(property => (
          <StyledTableCell className={classnames(classes.tableCell, (selectedDT ? classes.selectedRow : ''))} key={property.key} align="left">
            {device.properties.find(p => p.key === property.key) ? device.properties.find(p => p.key === property.key).val : ''}
          </StyledTableCell>
        ))}
        <StyledTableCell className={classnames(classes.tableCellLast, selectedDT ? classes.selectedRow : '')} align="right">
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
            title="More actions"
            ariaLabel="more actions"
            onClick={(e) => this.handleMenuClick(e, device)}
          >
            <MoreActionsIcon />
          </CustomTooltip>
          <Menu
            id="more-actions-menu"
            classes={{ paper: classes.menu}}
            open={Boolean(anchorMenu)}
            onClose={() => this.handleMenuClose('anchorMenu')}
            anchorEl={anchorMenu}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem
              key={uuid()}
              onClick={this.deleteDevice}
              classes={{ root: classes.menuItem}}
              // onClick={() => this.setConfirmOpen(true, device)}
            >
              Delete Device
            </MenuItem>
          </Menu>
          <ConfirmDialog
            title="Delete Device"
            open={confirmOpen}
            setOpen={this.setConfirmOpen}
            onConfirm={this.deleteDevice}
          >
            Are you sure you want to delete this device?
          </ConfirmDialog>
        </StyledTableCell>
      </React.Fragment>
    );
  };

  selectAll = () => {
    let { selected } = this.state;
    const { data } = this.state;
    if (selected.length === data.length) selected = [];
    else {
      selected = data.map(d => d.key);
    }
    this.setState({ selected });
  }

  generateTableColumns = (deviceType) => {
    const { classes } = this.props;
    const { data, selected } = this.state;
    const columns = [
      { key: uuid(),
        title:
  <div>
    <Checkbox
      indeterminate={selected.length > 0 && selected.length < data.length}
      checked={selected.length > 0 && selected.length === data.length}
      onClick={() => this.selectAll()}
      className={classes.checkboxWrapper}
      icon={
        <CheckBoxOutlineBlankIcon />
      }
      checkedIcon={
        <CheckBoxOutlinedIcon />
      }
      indeterminateIcon={
        <IndeterminateCheckBoxOutlinedIcon />
      }
      disableRipple
    />
    <span>device name</span>
  </div>,
      },
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

  deleteMultiple = async () => {
    const { match, client } = this.props;
    const mutation = deviceMutationUpdate;
    const { selected } = this.state;
    for (let i = 0; i < selected.length; i += 1) {
      const newEntity = { key: selected[i] };
      newEntity.action = 'update';
      newEntity.state = 'Deleted';
      newEntity.experimentId = match.params.id;
      newEntity.deviceTypeKey = match.params.deviceTypeKey;

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
    }
    this.setState({ update: true, selected: [] });
  }

  deleteDevice = async (device) => {
    let newEntity;
    if (device && device.key) newEntity = { ...device };
    else newEntity = this.state.device;
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

    this.setState({ update: true, anchorMenu: null });
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

  getData = (data) => {
    this.setState({ data });
  }

  render() {
    const { history, match } = this.props;
    const { deviceType, isCloneMultiplePanelOpen, device, selected, confirmMultipleOpen } = this.state;
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
              withAddButton={selected.length === 0}
              withDeleteButton={selected.length > 0}
              deleteButtonHandler={() => this.setConfirmMultipleOpen(true)}
              deleteButtonText={`Delete (${selected.length})`}
              withBackButton
              backButtonHandler={() => history.push(`/experiments/${match.params.id}/${DEVICE_TYPES_DASH}`)}
              rightDescription={deviceType.id}
              addButtonHandler={() => history.push(`/experiments/${match.params.id}/${DEVICE_TYPES_DASH}/${match.params.deviceTypeKey}/add-device`)}
            />
            <ConfirmDialog
              title={`Delete multiple devices`}
              open={confirmMultipleOpen}
              setOpen={this.setConfirmMultipleOpen}
              onConfirm={this.deleteMultiple}
              inputValidation
            >
              Are you sure you want to delete {selected.length} devices?
            </ConfirmDialog>
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
              getData={this.getData}
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
  withStyles(styles),
)(Devices);
