import React from 'react';
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
import { CloneIcon, PenIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';

class DeviceTypes extends React.Component {
    changeContentType = (contentType) => {
      this.props.changeContentType(contentType);
    };

    openDeviceType = (deviceType) => {
      this.changeContentType(DEVICES_CONTENT_TYPE);
      this.props.selectDeviceType(deviceType);
    };

    renderTableRow = deviceType => (
      <React.Fragment key={deviceType.key}>
        <StyledTableCell align="left">{deviceType.name}</StyledTableCell>
        <StyledTableCell align="left">{deviceType.properties.length}</StyledTableCell>
        <StyledTableCell align="left">{deviceType.numberOfDevices}</StyledTableCell>
        <StyledTableCell align="right">
          <CustomTooltip title="Clone" ariaLabel="clone">
            <CloneIcon />
          </CustomTooltip>
          <CustomTooltip title="Edit" aria-label="edit">
            <PenIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Open"
            className={this.props.classes.arrowButton}
            ariaLabel="open"
            onClick={() => this.openDeviceType(deviceType)}
          >
            <ArrowForwardIosIcon />
          </CustomTooltip>
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
            subscriptionUpdateField="deviceTypesUpdated"
            dataType={DEVICE_TYPES_CONTENT_TYPE}
            query={deviceTypesQuery}
            queryArgs={[this.props.experimentId]}
            tableHeadColumns={tableHeadColumns}
            subscription={deviceTypesSubscription}
            renderRow={this.renderTableRow}
          />
        </>
      );
    }
}

export default withStyles(styles)(DeviceTypes);
