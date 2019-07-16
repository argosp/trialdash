import React from 'react';
import PropTypes from 'prop-types';
import Graph from '../../../apolloGraphql';
import assetsQuery from '../utils/assetQuery';
import AssetForm from '../AssetForm';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { styles } from './styles';


const graphql = new Graph();


class ListOfAssets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: props.assets || [],
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
        {!this.state.editAsset ? <Paper className={classes.root}>
          <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="left">{this.props.entityType.charAt(0).toUpperCase() + this.props.entityType.slice(1)}s ID</TableCell>
              <TableCell align="left">{this.props.entityType.charAt(0).toUpperCase() + this.props.entityType.slice(1)}s Name</TableCell>
              <TableCell align="left">{this.props.entityType.charAt(0).toUpperCase() + this.props.entityType.slice(1)}s Type</TableCell>
              <TableCell align="left">{this.props.entityType.charAt(0).toUpperCase() + this.props.entityType.slice(1)}s Properties</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.assets.map((asset, index) => (
              <TableRow key={index} style={{cursor: 'pointer'}} onClick={() => this.setState({ editAsset: asset })}>
                <TableCell align="left">{asset.id}</TableCell>
                <TableCell align="left">{asset.name}</TableCell>
                <TableCell align="left">{asset.type}</TableCell>
                <TableCell align="left">{asset.properties && asset.properties.map(prop => `key: ${prop.key}, val: ${prop.val}`).toString()}</TableCell>
                <TableCell align="left">Edit</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper> :
      <AssetForm
        experimentId={this.props.experimentId}
        entityType={this.props.entityType}
        {...this.state.editAsset}
        cancel
        showAll={() => this.setState({ editAsset: null })}
      />}
      </div>
    );
  }

}

ListOfAssets.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListOfAssets);
