import React from 'react';
import PropTypes from 'prop-types';
import Graph from '../../../apolloGraphql';
import devicesQuery from '../utils/deviceQuery';

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
      <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell align="left">Devices ID</TableCell>
            <TableCell align="left">Devices Name</TableCell>
            <TableCell align="left">Devices Type</TableCell>
            <TableCell align="left">Devices Properties</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.devices.map((device) => (
            <TableRow>
              <TableCell align="left">{device.id}</TableCell>
              <TableCell align="left">{device.name}</TableCell>
              <TableCell align="left">{device.type}</TableCell>
              <TableCell align="left">{device.properties.map(prop => `key: ${prop.key}, val: ${prop.val}`).toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
    );
  }

}

ListOfDevices.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListOfDevices);
