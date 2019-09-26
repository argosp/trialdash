import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AssetForm from '../AssetForm';
import { styles } from './styles';

class ListOfAssets extends React.Component {
  render() {
    return (
      <div>
        {!this.state.editAsset ? (
          <Paper className={this.props.classes.root}>
            <Table className={this.props.classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="left">{this.props.entityType.charAt(0).toUpperCase() + this.props.entityType.slice(1)}s Name</TableCell>
                  <TableCell align="left">{this.props.entityType.charAt(0).toUpperCase() + this.props.entityType.slice(1)}s Type</TableCell>
                  <TableCell align="left">{this.props.entityType.charAt(0).toUpperCase() + this.props.entityType.slice(1)}s Properties</TableCell>
                  <TableCell align="left" />
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.assets.map(asset => (
                  <TableRow key={asset.id} style={{ cursor: 'pointer' }} onClick={() => this.setState({ editAsset: asset })}>
                    <TableCell align="left">{asset.name}</TableCell>
                    <TableCell align="left">{asset.type}</TableCell>
                    <TableCell align="left">{asset.properties && asset.properties.map(prop => `key: ${prop.key}, val: ${prop.val}`).toString()}</TableCell>
                    <TableCell align="left">Edit</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <AssetForm
            experimentId={this.props.experimentId}
            entityType={this.props.entityType}
            {...this.state.editAsset}
            cancel
            showAll={() => this.setState({ editAsset: null })}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ListOfAssets);
