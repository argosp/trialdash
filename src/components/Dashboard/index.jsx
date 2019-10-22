import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import { Subscription } from 'react-apollo';
import { isEmpty } from 'lodash';
import experimentsQuery from '../ExperimentContext/utils/experimentsQuery';
import ExperimentForm from '../ExperimentContext/ExperimentForm';
// import experimentsSubscription from '../utils/experimentsSubscription';
import { styles } from './styles';
import Header from '../Header';
import Graph from '../../apolloGraphql';
import TrialSetMainView from '../TrialSetContext';
import AssetMainView from '../AssetContext';
import DeviceMainView from '../DeviceContext';
import ExperimentMainView from '../ExperimentContext';

const graphql = new Graph();

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      experiments: [],
      render: false,
      timeout: false,
      currentExperiment: {},
      contentId: 3,
    };
  }

  componentDidMount() {
    graphql
      .sendQuery(experimentsQuery)
      .then((data) => {
        this.setState(() => ({
          experiments: data.experimentsWithData,
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

  changeContentId = (newValue) => {
    this.setState({ contentId: newValue });
  };

  selectActiveExperiment = (experiment) => {
    this.setState({ currentExperiment: experiment });
  };

  renderContent = (contentId) => {
    const { currentExperiment } = this.state;

    switch (contentId) {
      case 0:
      default:
        return <TrialSetMainView experimentId={currentExperiment.project.id} />;
      case 1:
        return (
          <AssetMainView
            experimentId={currentExperiment.project.id}
            entityType="asset"
          />
        );
      case 2:
        return (
          <DeviceMainView
            experimentId={currentExperiment.project.id}
            entityType="deviceType"
          />
        );
      case 3:
        return (
          <ExperimentMainView
            selectActiveExperiment={this.selectActiveExperiment}
            changeContentId={this.changeContentId}
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
      contentId,
    } = this.state;

    if (render) {
      return (
        <>
          {add && (
            <ExperimentForm
              close={() => {
                this.setState({ add: false });
              }}
            />
          )}
          <Header
            withExperiments={!isEmpty(currentExperiment)}
            selectActiveExperiment={this.selectActiveExperiment}
            currentExperiment={currentExperiment}
            experiments={experiments}
            handleTabChange={this.changeContentId}
            tabValue={contentId}
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
            {this.renderContent(contentId)}
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

export default withStyles(styles, { withTheme: true })(Dashboard);
