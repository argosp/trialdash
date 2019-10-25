import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { matchPath, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import experimentsQuery from '../ExperimentContext/utils/experimentsQuery';
import { styles } from './styles';
import Header from '../Header';
import Graph from '../../apolloGraphql';
import TrialSetMainView from '../TrialContext';
import AssetMainView from '../AssetContext';
import DeviceMainView from '../DeviceContext';
import ExperimentMainView from '../ExperimentContext';

const graphql = new Graph();

class AppLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      experiments: [],
      currentExperiment: {},
      contentId: 3,
      user: {},
    };
  }

  componentDidMount() {
    graphql
      .sendQuery(experimentsQuery)
      .then((data) => {
        this.setState({ experiments: data.experimentsWithData });
      });

    graphql
      .sendQuery(
        gql` {
          user(uid:"${localStorage.getItem('uid')}") {
              email
              name
              username
              avatar
          }
        }
        `,
      ).then((data) => {
        this.setState({ user: data.user });
      });
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

  render() {
    const { classes, children, location } = this.props;
    const {
      currentExperiment,
      experiments,
      contentId,
      user,
    } = this.state;

    const isExperimentOpen = matchPath(location.pathname, {
      path: '/experiments/:id',
      exact: false,
      strict: false,
    });

    return (
      <>
        <Header
          user={user}
          withExperiments={Boolean(isExperimentOpen)}
          selectActiveExperiment={this.selectActiveExperiment}
          currentExperiment={currentExperiment}
          experiments={experiments}
          handleTabChange={this.changeContentId}
          tabValue={contentId}
        />
        <div className={classes.contentWrapper}>
          {children}
        </div>
      </>
    );
  }
}

export default compose(withRouter, withStyles(styles))(AppLayout);
