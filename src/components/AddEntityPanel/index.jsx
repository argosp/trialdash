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
  ENTITIES_TYPES,
  ENTITIES,
} from '../../constants/base';
import entitiesTypesQuery from '../EntityContext/utils/entityTypeQuery';
import entitiesQuery from '../EntityContext/Entities/utils/entityQuery';
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
    selectedDevice: null,
  };

  renderDeviceTypesTableRow = (entitiesType) => {
    const { classes, theme } = this.props;
    return (
      <React.Fragment key={entitiesType.key}>
        <StyledTableCell className={classes.tableCell} align="left" onClick={() => this.setState({ selectedDevice: entitiesType })}>
          <ContentHeader
            title={entitiesType.name}
            bottomDescription={entitiesType.description || 'description'}
            classes={classes}
            className={classes.header}
          />
        </StyledTableCell>
        <StyledTableCell className={classes.tableCell} align="right">
          <CustomTooltip
            title="Open"
            className={classes.arrowButton}
            ariaLabel="open"
            onClick={() => this.setState({ selectedDevice: entitiesType })}
          >
            <ArrowForwardIosIcon style={{ color: theme.palette.gray.main }} />
          </CustomTooltip>
        </StyledTableCell>
      </React.Fragment>
    );
  };

  renderDevicesTableRow = (entity) => {
    const { classes, entities, theme } = this.props;
    const { selectedDevice } = this.state;
    if (entities.indexOf(entity.key) !== -1) return <React.Fragment key={entity.key} />;
    return (
      <React.Fragment key={entity.key}>
        <StyledTableCell className={classnames(classes.entityTableCell, classes.entityNameTableCell)} align="left">
          <DeviceIcon
            style={{ color: theme.palette.gray.main, marginRight: 10 }}
          />
          {entity.name}
        </StyledTableCell>
        {selectedDevice && selectedDevice.properties && selectedDevice.properties.map(property => (
          <>
            {!property.trialField
              && (
                <StyledTableCell className={classes.entityTableCell} key={property.key} align="left">
                  {entity.properties.find(p => p.key === property.key) ? entity.properties.find(p => p.key === property.key).val : ''}
                </StyledTableCell>
              )
            }
          </>
        ))}
        <StyledTableCell align="right" className={classnames(classes.entityTableCell, classes.entityActionsTableCell)}>
          <CustomTooltip
            title="Add"
            className={classes.arrowButton}
            ariaLabel="add"
          >
            <IconButton
              disableRipple
              className={classnames(classes.viewButton, classes.viewButtonSelected)}
              onClick={() => this.addDevice(entity)}
            >
              <PlusIcon />
            </IconButton>
          </CustomTooltip>
        </StyledTableCell>
      </React.Fragment>
    );
  };

  generateTableColumns = (entitiesType) => {
    const columns = [
      { key: uuid(), title: 'name' },
    ];

    if (!isEmpty(entitiesType) && !isEmpty(entitiesType.properties)) {
      entitiesType.properties.forEach((property) => {
        if (!property.trialField) {
          columns.push({ key: uuid(), title: property.label });
        }
      });
    }
    columns.push({ key: uuid(), title: '' });

    return columns;
  };

  addDevice = (entity) => {
    const { addEntity } = this.props;
    const { selectedDevice } = this.state;
    const properties = entity.properties.filter(p => selectedDevice.properties.find(s => s.key === p.key).trialField);
    addEntity(entity, 'entity', selectedDevice.key, properties);
  }

  changeTab = (event, tabValue) => {
    this.setState({ tabValue });
  };

  render() {
    const { classes, isPanelOpen, onClose, match } = this.props;
    const { tabValue, selectedDevice } = this.state;
    const entityTableHeadColumns = this.generateTableColumns(selectedDevice);

    return (
      <RightPanelContainer
        className={classes.rootPanel}
        isPanelOpen={isPanelOpen}
        onClose={onClose}
        title={<h3 className={classes.headerTitle}>Entities Types</h3>}
      >
        <StyledTabs
          className={classes.tabsWrapper}
          tabs={[
            { key: 0, label: 'Entities', id: 'trial-tab-0' },
          ]}
          value={tabValue}
          onChange={this.changeTab}
          ariaLabel="trial tabs"
        />
        <TabPanel value={tabValue} index={0}>
          {!selectedDevice
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
                  contentType={ENTITIES_TYPES}
                  query={entitiesTypesQuery(match.params.id)}
                  renderRow={this.renderDeviceTypesTableRow}
                  classes={classes}
                />
              </>
            )
            : (
              <>
                <ContentHeader
                  title={selectedDevice.name}
                  withBackButton
                  backButtonHandler={() => this.setState({ selectedDevice: null })}
                  bottomDescription={selectedDevice.description || 'description'}
                  classes={classes}
                  className={classes.entitiesTypeTitle}
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
                  contentType={ENTITIES}
                  query={entitiesQuery(match.params.id, selectedDevice.key)}
                  tableHeadColumns={entityTableHeadColumns}
                  renderRow={this.renderDevicesTableRow}
                  classes={classes}
                />
              </>
            )
          }
        </TabPanel>
      </RightPanelContainer>
    );
  }
}

export default withStyles(styles)(AddDevicePanel);
