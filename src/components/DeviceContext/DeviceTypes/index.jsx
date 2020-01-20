import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import ContentTable from '../../ContentTable';
import StyledTableCell from '../../StyledTableCell';
import AddSetForm from '../../AddSetForm';
import { styles } from './styles';
import {
  DEVICE_TYPES_DASH,
  DEVICE_TYPES,
  DEVICES,
  DEVICE_TYPE_MUTATION,
} from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import deviceTypesQuery from '../utils/deviceTypeQuery';
import { CloneIcon, PenIcon } from '../../../constants/icons';
import CustomTooltip from '../../CustomTooltip';

class DeviceTypes extends React.Component {
    state = {};

    renderTableRow = (deviceType) => {
      const { history, match, classes } = this.props;

      return (
        <React.Fragment key={deviceType.key}>
          <StyledTableCell align="left">{deviceType.name}</StyledTableCell>
          <StyledTableCell align="left">{deviceType.properties.length}</StyledTableCell>
          <StyledTableCell align="left">{deviceType.numberOfDevices}</StyledTableCell>
          <StyledTableCell align="right">
            <CustomTooltip title="Clone" ariaLabel="clone">
              <CloneIcon />
            </CustomTooltip>
            <CustomTooltip
              title="Edit"
              ariaLabel="edit"
              onClick={() => this.activateEditMode(deviceType)}
            >
              <PenIcon />
            </CustomTooltip>
            <CustomTooltip
              title="Open"
              className={classes.arrowButton}
              ariaLabel="open"
              onClick={() => history.push(`/experiments/${match.params.id}/${DEVICE_TYPES_DASH}/${deviceType.key}/${DEVICES}`)}
            >
              <ArrowForwardIosIcon />
            </CustomTooltip>
          </StyledTableCell>
        </React.Fragment>
      );
    };

    activateEditMode = (deviceType) => {
      this.setState({
        isEditModeEnabled: true,
        deviceType,
      });
    };

    returnFunc = () => {
      this.setState({
        isEditModeEnabled: false,
      });
    }

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
      const { history, match } = this.props;

      return (
        <>
          {this.state.isEditModeEnabled
            // eslint-disable-next-line react/jsx-wrap-multilines
            ? <AddSetForm
              {...this.props}
              deviceType={this.state.deviceType}
              formType={DEVICE_TYPES_DASH}
              cacheQuery={deviceTypesQuery}
              itemsName={DEVICE_TYPES}
              mutationName={DEVICE_TYPE_MUTATION}
              returnFunc={this.returnFunc}
            />
            // eslint-disable-next-line react/jsx-wrap-multilines
            : <>
              <ContentHeader
                withSearchInput
                title="Devices types"
                searchPlaceholder="Search Devices types"
                addButtonText="Add device type"
                addButtonHandler={() => history.push(`/experiments/${match.params.id}/add-device-type`)}
              />
              <ContentTable
                contentType={DEVICE_TYPES}
                query={deviceTypesQuery(match.params.id)}
                tableHeadColumns={tableHeadColumns}
                renderRow={this.renderTableRow}
              />
            </>
          }
        </>
      );
    }
}

export default compose(
  withRouter,
  withStyles(styles),
)(DeviceTypes);
