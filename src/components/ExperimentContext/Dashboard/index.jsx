import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import { Subscription } from 'react-apollo';
import experimentsQuery from '../utils/experiments-query';
import ExperimentForm from '../ExperimentForm';
// import experimentsSubscription from '../utils/experimentsSubscription';
import { styles } from './styles';
import Header from '../../Header';
import Graph from '../../../apolloGraphql';
import TrialSetMainView from '../../TrialSetContext';
import AssetMainView from '../../AssetContext';
import DeviceMainView from '../../DeviceContext';

const graphql = new Graph();

class ListOfExperiments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      experiments: [],
      render: false,
      timeout: false,
      currentExperiment: { name: '', id: '' },
      headerTabValue: 0,
    };
  }

  componentDidMount() {
    graphql
      .sendQuery(experimentsQuery)
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
      // TODO Fix needed. Don't use setState in componentDidUpdate
      // eslint-disable-next-line
      this.setState(() => ({ render: true }));
    }
  }

  handleHeaderTabChange = (newValue) => {
    this.setState({ headerTabValue: newValue });
  };

  selectActiveExperiment = (id, name) => {
    const currentExperiment = { name, id };
    this.setState({ currentExperiment });
  };

  renderContent = (tabValue) => {
    const { currentExperiment } = this.state;

    switch (tabValue) {
      case 0:
      default:
        return <TrialSetMainView experimentId={currentExperiment.id} />;
      case 1:
        return (
          <AssetMainView
            experimentId={currentExperiment.id}
            entityType="asset"
          />
        );
      case 2:
        return (
          <DeviceMainView
            experimentId={currentExperiment.id}
            entityType="deviceType"
          />
        );
    }
  };

  /*  logout = () => {
    const { history } = this.props;
    localStorage.clear();
    history.push('/login');
  } */

  render() {
    const { classes } = this.props;
    const {
      currentExperiment,
      experiments,
      render,
      add,
      timeout,
      headerTabValue,
    } = this.state;

    if (render) {
      return (
        <>
          {add && (<ExperimentForm close={() => { this.setState({ add: false }); }} />)}
          <Header
            selectActiveExperiment={this.selectActiveExperiment}
            currentExperiment={currentExperiment}
            experiments={experiments}
            handleTabChange={this.handleHeaderTabChange}
            tabValue={headerTabValue}
          />
          {/*
              <Button
                onClick={this.logout}
              >
                Logout
            </Button>
            <div onClick={() => this.setState({ add: true })}> + Add An Experiment</div>
          */}

          <div className={classes.contentWrapper}>
            {
              currentExperiment.id ? (this.renderContent(headerTabValue))
                : (<div>Select an Experiment Or add a new Experiment</div>)
            }
          </div>

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
    return timeout ? <p>Something went wrong... </p> : <p>Please wait... </p>;
  }
}

export default withStyles(styles, { withTheme: true })(ListOfExperiments);
