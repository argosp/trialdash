import React from 'react';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import SearchIcon from '@material-ui/icons/Search';
import RightPanelContainer from '../RightPanelContainer';
import StyledTableCell from '../StyledTableCell';
import CustomTooltip from '../CustomTooltip';
import StyledTabs from '../StyledTabs';
import { PlusIcon, DeviceIcon } from '../../constants/icons';
import {
  DEVICE_TYPES,
  DEVICES,
} from '../../constants/base';
import deviceTypesQuery from '../DeviceContext/utils/deviceTypeQuery';
import devicesQuery from '../DeviceContext/Devices/utils/deviceQuery';
import ContentTable from '../ContentTable';
import ContentHeader from '../ContentHeader';
import { styles } from './styles';

const TabPanel = ({ children, value, index, ...other }) => (
  <Typography
    component="div"
    role="tabpanel"
    hidden={value !== index}
    id={`trial-tabpanel-${index}`}
    aria-labelledby={`trial-tab-${index}`}
    style={{ marginBottom: '100px' }}
    {...other}
  >
    <Box>{children}</Box>
  </Typography>
);

class AddDevicePanel extends React.Component {
  state = {
    tabValue: 0,
    selectedDeviceType: null,
  };

  renderDeviceTypesTableRow = (deviceType) => {
    const { classes, theme } = this.props;
    return (
      <React.Fragment key={deviceType.key}>
        <StyledTableCell className={classes.tableCell} align="left" onClick={() => this.setState({ selectedDeviceType: deviceType })}>
          <ContentHeader
            title={deviceType.name}
            bottomDescription={deviceType.description || 'description'}
            classes={classes}
            className={classes.header}
          />
        </StyledTableCell>
        <StyledTableCell className={classes.tableCell} align="right">
          <CustomTooltip
            title="Open"
            className={classes.arrowButton}
            ariaLabel="open"
            onClick={() => this.setState({ selectedDeviceType: deviceType })}
          >
            <ArrowForwardIosIcon style={{ color: theme.palette.gray.main }} />
          </CustomTooltip>
        </StyledTableCell>
      </React.Fragment>
    );
  };

  renderDevicesTableRow = (device) => {
    const { classes, entities, theme } = this.props;
    const { selectedDeviceType } = this.state;
    if (entities.indexOf(device.key) !== -1) return <React.Fragment key={device.key} />;
    return (
      <React.Fragment key={device.key}>
        <StyledTableCell className={classnames(classes.deviceTableCell, classes.deviceNameTableCell)} align="left">
          <DeviceIcon
            style={{ color: theme.palette.gray.main, marginRight: 10 }}
          />
          {device.name}
        </StyledTableCell>
        {selectedDeviceType && selectedDeviceType.properties && selectedDeviceType.properties.map(property => (
          <>
            {!property.trialField
              && (
                <StyledTableCell className={classes.deviceTableCell} key={property.key} align="left">
                  {device.properties.find(p => p.key === property.key) ? device.properties.find(p => p.key === property.key).val : ''}
                </StyledTableCell>
              )
            }
          </>
        ))}
        <StyledTableCell align="right" className={classnames(classes.deviceTableCell, classes.deviceActionsTableCell)}>
          <CustomTooltip
            title="Add"
            className={classes.arrowButton}
            ariaLabel="add"
          >
            <IconButton
              disableRipple
              className={classnames(classes.viewButton, classes.viewButtonSelected)}
              onClick={() => this.addDevice(device)}
            >
              <PlusIcon />
            </IconButton>
          </CustomTooltip>
        </StyledTableCell>
      </React.Fragment>
    );
  };

  generateTableColumns = (deviceType) => {
    const columns = [
      { key: uuid(), title: 'name' },
    ];

    if (!isEmpty(deviceType) && !isEmpty(deviceType.properties)) {
      deviceType.properties.forEach((property) => {
        if (!property.trialField) {
          columns.push({ key: uuid(), title: property.label });
        }
      });
    }
    columns.push({ key: uuid(), title: '' });

    return columns;
  };

  addDevice = (device) => {
    const { addEntity } = this.props;
    const { selectedDeviceType } = this.state;
    const properties = device.properties.filter(p => selectedDeviceType.properties.find(s => s.key === p.key).trialField);
    addEntity(device, selectedDeviceType.key, properties);
  }

  changeTab = (event, tabValue) => {
    this.setState({ tabValue });
  };

  render() {
    const { classes, isPanelOpen, onClose, match } = this.props;
    const { tabValue, selectedDeviceType } = this.state;
    const deviceTableHeadColumns = this.generateTableColumns(selectedDeviceType);

    return (
      <RightPanelContainer
        className={classes.rootPanel}
        isPanelOpen={isPanelOpen}
        onClose={onClose}
        title={<h3 className={classes.headerTitle}>Device Types</h3>}
      >
        <StyledTabs
          className={classes.tabsWrapper}
          tabs={[
            { key: 0, label: 'Devices', id: 'trial-tab-0' },
            { key: 1, label: 'Assets', id: 'trial-tab-1' },
          ]}
          value={tabValue}
          onChange={this.changeTab}
          ariaLabel="trial tabs"
        />
        <TabPanel value={tabValue} index={0}>
          {!selectedDeviceType
            ? (
              <>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="search"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                      focused: classes.inputFocused,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </div>
                <ContentTable
                  contentType={DEVICE_TYPES}
                  query={deviceTypesQuery(match.params.id)}
                  renderRow={this.renderDeviceTypesTableRow}
                  classes={classes}
                />
              </>
            )
            : (
              <>
                <ContentHeader
                  title={selectedDeviceType.name}
                  withBackButton
                  backButtonHandler={() => this.setState({ selectedDeviceType: null })}
                  bottomDescription={selectedDeviceType.description || 'description'}
                  classes={classes}//yehuidt
                  className={classes.deviceTypeTitle}
                />
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="search"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                      focused: classes.inputFocused,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </div>
                <ContentTable
                  contentType={DEVICES}
                  query={devicesQuery(match.params.id, selectedDeviceType.key)}
                  tableHeadColumns={deviceTableHeadColumns}
                  renderRow={this.renderDevicesTableRow}
                  classes={classes}
                />
              </>
            )
          }
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <></>
        </TabPanel>
      </RightPanelContainer>
    );
  }
}

export default withStyles(styles)(AddDevicePanel);
