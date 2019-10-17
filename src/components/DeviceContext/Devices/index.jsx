import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import ContentHeader from '../../ContentHeader';
import TableContentContainer from '../../TableContentContainer';
import {
  DEVICE_FORM_CONTENT_TYPE, DEVICES_CONTENT_TYPE,
} from '../../../constants/base';
import StyledTableCell from '../../StyledTableCell';
import devicesQuery from './utils/deviceQuery';
import devicesSubscription from './utils/deviceSubscription';
import { ReactComponent as CloneIcon } from '../../../assets/icons/clone.svg';
import { ReactComponent as PenIcon } from '../../../assets/icons/pen.svg';

class Devices extends React.Component {
    changeContentType = (contentType) => {
      this.props.changeContentType(contentType);
    };

  renderTableRow = device => (
    <React.Fragment key={device.id}>
      <StyledTableCell align="left">{device.name}</StyledTableCell>
      <StyledTableCell align="left">{device.id}</StyledTableCell>
      <StyledTableCell align="left">{device.height}</StyledTableCell>
      <StyledTableCell align="left">{device.sku}</StyledTableCell>
      <StyledTableCell align="left">{device.brand}</StyledTableCell>
      <StyledTableCell align="right">
        <Tooltip title="Clone device">
          <IconButton
            aria-label="clone device"
          >
            <SvgIcon component={CloneIcon} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit device">
          <IconButton
            aria-label="edit device"
          >
            <SvgIcon component={PenIcon} />
          </IconButton>
        </Tooltip>
      </StyledTableCell>
    </React.Fragment>
  );

  render() {
    const { experimentId, deviceTypeId } = this.props;
    const tableHeadColumns = [
      { key: 0, title: 'device name' },
      { key: 1, title: 'id' },
      { key: 2, title: 'height' },
      { key: 3, title: 'sku' },
      { key: 4, title: 'brand' },
      { key: 7, title: '' },
    ];

    return (
      <>
        <ContentHeader
          withSearchInput
          title="Device type"
          searchPlaceholder="Search Devices"
          addButtonText="Add device"
          withBackButton
          backButtonHandler={this.changeContentType}
          rightDescription={deviceTypeId}
          addButtonHandler={() => this.changeContentType(DEVICE_FORM_CONTENT_TYPE)}
        />
        <TableContentContainer
          subscriptionUpdateField="devicesUpdated"
          dataType={DEVICES_CONTENT_TYPE}
          query={devicesQuery}
          queryArgs={[experimentId, deviceTypeId]}
          tableHeadColumns={tableHeadColumns}
          subscription={devicesSubscription}
          renderRow={this.renderTableRow}
        />
      </>
    );
  }
}

export default Devices;
