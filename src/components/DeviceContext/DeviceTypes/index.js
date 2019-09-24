import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import TableContentContainer from '../../TableContentContainer';
import StyledTableCell from '../../StyledTableCell';
import { styles } from './styles';
import {
  DEVICE_TYPE_FORM_CONTENT_TYPE,
  DEVICE_TYPES_CONTENT_TYPE,
  DEVICES_CONTENT_TYPE,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import deviceTypesQuery from '../utils/deviceTypeQuery';
import deviceTypesSubscription from '../utils/deviceTypesSubscription';

class DeviceTypes extends React.Component {
    changeContentType = (contentType) => {
      this.props.changeContentType(contentType);
    };

    renderTableRow = deviceType => (
      <React.Fragment key={deviceType.id}>
        <StyledTableCell align="left">Device name</StyledTableCell>
        <StyledTableCell align="left">Fields</StyledTableCell>
        <StyledTableCell align="left">Devices</StyledTableCell>
        <StyledTableCell align="right">
          <Tooltip title="Clone device type">
            <IconButton
              aria-label="clone device type"
            >
              <QueueOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit device type">
            <IconButton
              aria-label="edit device type"
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open device type" className={this.props.classes.arrowButton}>
            <IconButton
              aria-label="open device type"
              onClick={() => this.changeContentType(DEVICES_CONTENT_TYPE)}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Tooltip>
        </StyledTableCell>
      </React.Fragment>
    );

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

      return (
        <>
          <ContentHeader
            withSearchInput
            title="Devices types"
            searchPlaceholder="Search Devices types"
            addButtonText="Add device type"
            addButtonHandler={() => this.changeContentType(DEVICE_TYPE_FORM_CONTENT_TYPE)}
          />
          <TableContentContainer
            subscriptionUpdateField="devicesUpdated"
            dataType={DEVICE_TYPES_CONTENT_TYPE}
            query={deviceTypesQuery}
            queryArgs={[this.props.experimentId, this.props.entityType]}
            tableHeadColumns={tableHeadColumns}
            subscription={deviceTypesSubscription}
            renderRow={this.renderTableRow}
          />
        </>
      );
    }
}

export default withStyles(styles)(DeviceTypes);
