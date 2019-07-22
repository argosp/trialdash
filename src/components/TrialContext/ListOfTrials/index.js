import React from 'react';
import PropTypes from 'prop-types';
import Graph from '../../../apolloGraphql';
import trialsQuery from '../utils/trialQuery';
import TrialForm from '../TrialForm';
import devicesQuery from '../../DeviceContext/utils/deviceQuery';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Query, Subscription } from 'react-apollo';
import { styles } from './styles';

const graphql = new Graph();


class ListOfTrials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trials: props.trials || [],
      timeout: false,
      experimentId: props.experimentId || ""
    }
  }

  componentDidMount() {
  }
  componentDidUpdate() {
    if (this.state.experimentId !== this.props.experimentId) {
      const experimentId = this.props.experimentId
      this.setState(() => ({ experimentId, editTrial: null }))
      this.fetchTrials(experimentId)
    }
  }
  fetchTrials = (experimentId) => {
    graphql.sendQuery(trialsQuery(experimentId))
      .then(data => this.setState(() => ({ trials: data.trials })))
  }
  render() {
    const classes = this.props;
    return (
      <div>
        {!this.state.editTrial ? <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="left">Trial Name</TableCell>
                <TableCell align="left">Trial Begin</TableCell>
                <TableCell align="left">Trial End</TableCell>
                <TableCell align="left">Trial Devices</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.trials.map((trial, index) => (
                <TableRow key={index} style={{cursor: 'pointer'}} onClick={() => this.setState({ editTrial: trial })}>
                  <TableCell align="left">{trial.name}</TableCell>
                  <TableCell align="left">{trial.begin}</TableCell>
                  <TableCell align="left">{trial.end}</TableCell>
                  <TableCell align="left">{trial.device && trial.device.name}</TableCell>
                  <TableCell align="left" onClick={() => this.setState({ editTrial: trial })}>Edit</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper> :
          <TrialForm
            {...this.state.editTrial}
            experimentId={this.state.experimentId}
            cancel
            showAll={() => this.setState({ editTrial: null })}
          />            
        }
      </div>
    );
  }

}

ListOfTrials.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListOfTrials);
