import React from 'react';
import {
  EXPERIMENT_FORM_CONTENT_TYPE,
  EXPERIMENTS_CONTENT_TYPE,
} from '../../constants/base';
import Experiments from './Experiments';
import ExperimentForm from './ExperimentForm';

class ExperimentMainView extends React.PureComponent {
  state = {
    currentContentType: EXPERIMENTS_CONTENT_TYPE,
  };

  switchCurrentContentType = (contentType) => {
    this.setState({ currentContentType: contentType });
  };

  renderContent = (contentType) => {
    const { selectActiveExperiment, changeContentId } = this.props;

    switch (contentType) {
      case EXPERIMENTS_CONTENT_TYPE:
      default:
        return (
          <Experiments
            openExperiment={selectActiveExperiment}
            changeContentId={changeContentId}
            changeContentType={this.switchCurrentContentType}
          />
        );
      case EXPERIMENT_FORM_CONTENT_TYPE:
        return (
          <ExperimentForm
            changeContentType={this.switchCurrentContentType}
          />
        );
    }
  };

  render() {
    return <>{this.renderContent(this.state.currentContentType)}</>;
  }
}

export default ExperimentMainView;
