import React from 'react';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ContentHeader from '../../../ContentHeader';
import ContentTable from '../../../ContentTable';
import StyledTableCell from '../../../StyledTableCell';
import CustomTooltip from '../../../CustomTooltip';
import CustomInput from '../../../CustomInput';
import { BasketIcon } from '../../../../constants/icons';

import {
  DEVICES,
} from '../../../../constants/base';

class DevicesGrid extends React.Component {
  state = {
    open: {},
  };

  deviceTableHeadColumns = (deviceType) => {
    if (!deviceType || !this) return [];
    const headers = [{ key: deviceType.key, title: 'device name' }];
    deviceType.properties.forEach(p => headers.push({ key: p.key, title: p.label }));
    headers.push({ key: `${deviceType.key}-actions`, title: '' });
    return headers;
  }

  renderDevicesTableRow = (device) => {
    const { classes, removeEntity, onEntityPropertyChange, devices, deviceTypes } = this.props;
    return (
      <React.Fragment key={device.key}>
        <StyledTableCell classes={{ body: classes.deviceGridTd }} className={classes.tableCell} align="left">{devices[device.key][0].name}</StyledTableCell>
        {deviceTypes[device.typeKey] && deviceTypes[device.typeKey][0] && deviceTypes[device.typeKey][0].properties
        && deviceTypes[device.typeKey][0].properties.map(property => (
          <>
            {property.trialField
              ? (
                <StyledTableCell classes={{ body: classes.deviceGridTd }} key={property.key} align="left">
                  <CustomInput
                    value={device.properties && device.properties.find(p => p.key === property.key) ? device.properties.find(p => p.key === property.key).val : ''}
                    onChange={e => onEntityPropertyChange(device, e, property.key)}
                    id={`device-property-${property.key}`}
                    className={classes.input}
                    type={property.type}
                    values={property.value}
                    multiple={property.multipleValues}
                  />
                </StyledTableCell>
              ) : (
                <StyledTableCell classes={{ body: classes.deviceGridTd }} key={property.key} align="left">
                  {devices[device.key][0].properties.find(p => p.key === property.key) ? devices[device.key][0].properties.find(p => p.key === property.key).val : ''}
                </StyledTableCell>
              )
            }
          </>
        ))}
        <StyledTableCell classes={{ body: classes.deviceGridTd }} align="right">
          <CustomTooltip
            title="Delete"
            ariaLabel="delete"
            onClick={() => removeEntity(device.key)}
          >
            <BasketIcon />
          </CustomTooltip>
        </StyledTableCell>
      </React.Fragment>
    );
  };

  openTable = (e) => {
    this.state.open[e] = !this.state.open[e];
    this.setState({ });
  }

  render() {
    const { classes, entities, deviceTypes, update, setUpdated } = this.props;
    const {
      open,
    } = this.state;
    return (
      <>
        {Object.keys(entities).filter(e => Object.keys(deviceTypes).indexOf(e) !== -1).map(e => (
          <Grid
            className={classes.wrapper}
            key={e}
          >
            <ContentHeader
              onClick={() => this.openTable(e)}
              className={classes.contentHeader}
              title={deviceTypes && deviceTypes[e] && deviceTypes[e][0].name}
              bottomDescription={deviceTypes && deviceTypes[e] && deviceTypes[e][0].description}
              rightComponent={(
                <CustomTooltip
                  title="Open"
                  className={open[e] ? classes.arrowDown : ''}
                  ariaLabel="open"
                >
                  <ArrowForwardIosIcon />
                </CustomTooltip>
              )}
            />
            <Collapse in={open[e]} timeout="auto" unmountOnExit>
              <ContentTable
                classes={{ table: classes.deviceGridTable,
                  head: classes.deviceGridTableHead,
                  tableBodyRow: classes.deviceGridTableBodyRow,
                }}
                items={entities[e]}
                contentType={DEVICES}
                tableHeadColumns={this.deviceTableHeadColumns(deviceTypes && deviceTypes[e] && deviceTypes[e][0])}
                renderRow={this.renderDevicesTableRow}
                update={update}
                setUpdated={setUpdated}
              />
            </Collapse>
          </Grid>
        ))}
      </>
    );
  }
}

export default DevicesGrid;
