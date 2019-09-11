import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
// import { Subscription } from 'react-apollo';
import experimentsQuery from '../utils/experiments-query';
import ExperimentForm from '../ExperimentForm';
// import experimentsSubscription from '../utils/experimentsSubscription';
import { styles } from './styles';
import MainView from '../MainView';
import Header from '../../Header';
import Graph from '../../../apolloGraphql';

const graphql = new Graph();

class ListOfExperiments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      experiments: [],
      render: false,
      timeout: false,
      currentExperiment: { name: '', id: '' },
    };
  }

  componentDidMount() {
    graphql.sendQuery(experimentsQuery)
      .then((data) => {
        this.setState(() => ({
          experiments: data.experiments,
          render: true,
        }));
      })
      .then(() => {
        setTimeout(() => {
          this.setState(() => ({ timeout: true }));
        }, 5000);
      });
  }

  componentDidUpdate() {
    const { experiments, render } = this.state;

    if (experiments && experiments.length > 0 && render === false) {
      this.setState(() => ({ render: true }));
    }
  }

  selectActiveExperiment = (id, name) => {
    const currentExperiment = { name, id };
    this.setState({ currentExperiment });
  };

  /*  logout = () => {
    const { history } = this.props;
    localStorage.clear();
    history.push('/login');
  } */

  render() {
    const { classes } = this.props;
    const {
      currentExperiment, experiments, render, add, timeout,
    } = this.state;
    if (render) {
      return (
        <>
          {add && <ExperimentForm close={() => { this.setState({ add: false }); }} />}
          <Header
            selectActiveExperiment={this.selectActiveExperiment}
            currentExperiment={currentExperiment}
            experiments={experiments}
          />
          {/*
              <Button
                onClick={this.logout}
              >
                Logout
            </Button>
            <div onClick={() => this.setState({ add: true })}> + Add An Experiment</div>
          */}
          <main
            className={classNames(classes.content, {
              [classes.contentShift]: true,
            })}
          >
            <MainView id={currentExperiment.id} />
          </main>
          {/* <Subscription
            subscription={experimentsSubscription}>
            {({ data, loading }) => {
              if (data && data.experimentsUpdated)
                this.queryRefecth !== null && this.queryRefecth();
              return null
            }}
          </Subscription> */}
        </>
      );
    }
    return timeout
      ? (<p>Something went wrong... </p>)
      : (<p>Please wait... </p>);
  }
}

export default withStyles(styles, { withTheme: true })(ListOfExperiments);
