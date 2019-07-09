import React from 'react';
import PropTypes from 'prop-types';
import Graph from '../../../apolloGraphql';
import devicesQuery from '../utils/deviceQuery';
import DeviceForm from '../DeviceForm';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { styles } from './styles';


const graphql = new Graph();


class ListOfDevices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: props.devices || [],
      timeout: false
    }
  }

  componentDidMount() {
  }
  componentDidUpdate() {
  }

  render() {
    const classes = this.props;
    return (
      <div>
        {!this.state.editDevice ? <Paper className={classes.root}>
          <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="left">Devices ID</TableCell>
              <TableCell align="left">Devices Name</TableCell>
              <TableCell align="left">Devices Type</TableCell>
              <TableCell align="left">Devices Properties</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.devices.map((device, index) => (
              <TableRow key={index} style={{cursor: 'pointer'}} onClick={() => this.setState({ editDevice: device })}>
                <TableCell align="left">{device.id}</TableCell>
                <TableCell align="left">{device.name}</TableCell>
                <TableCell align="left">{device.type}</TableCell>
                <TableCell align="left">{device.properties && device.properties.map(prop => `key: ${prop.key}, val: ${prop.val}`).toString()}</TableCell>
                <TableCell align="left">Edit</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper> :
      <DeviceForm
        experimentId={this.props.experimentId}
        {...this.state.editDevice}
        cancel
        showAll={() => this.setState({ editDevice: null })}
      />}
      </div>
    );
  }

}

ListOfDevices.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListOfDevices);
