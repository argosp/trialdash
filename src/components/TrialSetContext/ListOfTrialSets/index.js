import React from 'react';
import PropTypes from 'prop-types';
import Graph from '../../../apolloGraphql';
import TrialSetForm from '../TrialSetForm';
import TrialForm from '../../TrialContext/TrialForm';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
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

  addTrial = (trialSet) => {
    console.log('----------------');
    this.setState({addTrial: true, selected: trialSet });
  }

  render() {
    const classes = this.props;
    if (!this.state.addTrial) return (
      <div>
        {!this.state.editTrialSet ? <Paper className={classes.root}>
          <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="left">TrialSets Name</TableCell>
              <TableCell align="left">TrialSets Properties</TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.trialSets.map((trialSet, index) => (
              <TableRow key={index} >
                <TableCell align="left">{trialSet.name}</TableCell>
                <TableCell align="left">{trialSet.properties && trialSet.properties.map((ts, i) => <span key={i}>{ts.key}, </span>)}</TableCell>
                <TableCell align="left" style={{cursor: 'pointer'}} onClick={() => this.setState({ editTrialSet: trialSet })}>Edit</TableCell>
                <TableCell align="left">
                  <Button variant="contained" className={classes.button} style={{ width: '180px' }}
                    onClick={() => this.addTrial(trialSet)}
                  >
                  + Add Trial
                  </Button>
                </TableCell>
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
    ); else return(
      <TrialForm
        experimentId={this.props.experimentId}
        trialSet={this.state.selected}
        showAll={() => this.setState({ addTrial: false })}
        cancel
      />
    )
  }

}

ListOfTrialSets.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListOfTrialSets);
