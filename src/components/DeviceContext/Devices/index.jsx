import React from 'react';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
import ContentHeader from '../../ContentHeader';
import TableContentContainer from '../../TableContentContainer';
import {
  DEVICE_FORM_CONTENT_TYPE,
  DEVICE_TYPES_CONTENT_TYPE,
  DEVICES_CONTENT_TYPE,
} from '../../../constants/base';
import StyledTableCell from '../../StyledTableCell';
import devicesQuery from './utils/deviceQuery';
import devicesSubscription from './utils/deviceSubscription';
import { CloneIcon, PenIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';
import Graph from '../../../apolloGraphql';
import deviceTypesQuery from '../utils/deviceTypeQuery';

const graphql = new Graph();

class Devices extends React.Component {
  state = {
    deviceType: {},
  };

  componentDidMount() {
    const { experimentId, deviceTypeKey } = this.props;

    graphql.sendQuery(deviceTypesQuery(experimentId)).then((data) => {
      this.setState({
        deviceType: data.deviceTypes.find(
          deviceType => deviceType.key === deviceTypeKey,
        ),
      });
    });
  }

  renderTableRow = device => (
    <React.Fragment key={device.key}>
      <StyledTableCell align="left">{device.name}</StyledTableCell>
      <StyledTableCell align="left">{device.id}</StyledTableCell>
      {device.properties.map(property => (
        <StyledTableCell key={property.key} align="left">
          {property.val}
        </StyledTableCell>
      ))}
      <StyledTableCell align="right">
        <CustomTooltip title="Clone" ariaLabel="clone">
          <CloneIcon />
        </CustomTooltip>
        <CustomTooltip title="Edit" ariaLabel="edit">
          <PenIcon />
        </CustomTooltip>
      </StyledTableCell>
    </React.Fragment>
  );

  generateTableColumns = (deviceType) => {
    const columns = [
      { key: uuid(), title: 'device name' },
      { key: uuid(), title: 'id' },
    ];

    if (!isEmpty(deviceType) && !isEmpty(deviceType.properties)) {
      deviceType.properties.forEach((property, index) => {
        if (index === deviceType.properties.length - 1) { // the last column is static (buttons)
          columns.push(
            { key: uuid(), title: property.label },
            { key: uuid(), title: '' },
          );

          return;
        }

        columns.push({ key: uuid(), title: property.label });
      });
    }

    return columns;
  };

  render() {
    const { experimentId, changeContentType } = this.props;
    const { deviceType } = this.state;
    const tableHeadColumns = this.generateTableColumns(deviceType);

    return (
      <>
        <ContentHeader
          withSearchInput
          title={deviceType.name}
          searchPlaceholder="Search Devices"
          addButtonText="Add device"
          withBackButton
          backButtonHandler={() => changeContentType(DEVICE_TYPES_CONTENT_TYPE)}
          rightDescription={deviceType.id}
          addButtonHandler={() => changeContentType(DEVICE_FORM_CONTENT_TYPE)}
        />
        {deviceType.key ? (
          <TableContentContainer
            subscriptionUpdateField="devicesUpdated"
            dataType={DEVICES_CONTENT_TYPE}
            query={devicesQuery}
            queryArgs={[experimentId, deviceType.key]}
            tableHeadColumns={tableHeadColumns}
            subscription={devicesSubscription}
            renderRow={this.renderTableRow}
          />
        ) : ('Loading...')}
      </>
    );
  }
}

export default Devices;
