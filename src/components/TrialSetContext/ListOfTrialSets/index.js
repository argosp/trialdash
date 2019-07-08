import React from 'react';
import PropTypes from 'prop-types';
import Graph from '../../../apolloGraphql';
import TrialSetForm from '../TrialSetForm';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { styles } from './styles';


const graphql = new Graph();


class ListOfTrialSets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trialSets: props.trialSets || [],
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
        {!this.state.editTrialSet ? <Paper className={classes.root}>
          <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="left">TrialSets ID</TableCell>
              <TableCell align="left">TrialSets Begin</TableCell>
              <TableCell align="left">TrialSets End</TableCell>
              <TableCell align="left">TrialSets Properties</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.trialSets.map((trialSet, index) => (
              <TableRow key={index} style={{cursor: 'pointer'}} onClick={() => this.setState({ editTrialSet: trialSet })}>
                <TableCell align="left">{trialSet.id}</TableCell>
                <TableCell align="left">{trialSet.begin}</TableCell>
                <TableCell align="left">{trialSet.end}</TableCell>
                <TableCell align="left">{trialSet.properties && trialSet.properties.map((ts, i) => <span key={i}>{ts.key}, </span>)}</TableCell>
                <TableCell align="left">Edit</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper> :
      <TrialSetForm
        experimentId={this.props.experimentId}
        {...this.state.editTrialSet}
        cancel
        showAll={() => this.setState({ editTrialSet: null })}
      />}
      </div>
    );
  }

}

ListOfTrialSets.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListOfTrialSets);
