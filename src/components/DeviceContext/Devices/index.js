import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { styles } from './styles';
import ContentHeader from '../../ContentHeader';
// import TableContentContainer from '../../TableContentContainer';
import {
  DEVICE_FORM_CONTENT_TYPE,
} from '../../../constants/base';
import StyledTableCell from '../../StyledTableCell';

class Devices extends React.Component {
    changeContentType = (contentType) => {
      this.props.changeContentType(contentType);
    };

  renderTableRow = device => (
    <React.Fragment key={device.id}>
      <StyledTableCell align="left">Device name</StyledTableCell>
      <StyledTableCell align="left">{device.id}</StyledTableCell>
      <StyledTableCell align="left">Height</StyledTableCell>
      <StyledTableCell align="left">SKU</StyledTableCell>
      <StyledTableCell align="left">Brand</StyledTableCell>
      <StyledTableCell align="right">
        <Tooltip title="Clone device">
          <IconButton
            aria-label="clone device"
          >
            <QueueOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit device">
          <IconButton
            aria-label="edit device"
          >
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      </StyledTableCell>
    </React.Fragment>
  );

  render() {
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
          rightDescription="Short description"
          addButtonHandler={() => this.changeContentType(DEVICE_FORM_CONTENT_TYPE)}
        />
        {/* <TableContentContainer
          subscriptionUpdateField=""
          dataType={DEVICES_CONTENT_TYPE}
          query={''}
          queryArgs={''}
          tableHeadColumns={tableHeadColumns}
          subscription={''}
          renderRow={this.renderTableRow}
        /> */}
      </>
    );
  }
}

export default withStyles(styles)(Devices);
