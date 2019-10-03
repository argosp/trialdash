import React from 'react';
import {
  TRIAL_SETS_CONTENT_TYPE,
  TRIALS_CONTENT_TYPE,
  TRIAL_SET_FORM_CONTENT_TYPE,
} from '../../constants/base';
import TrialSets from './TrialSets';
import Trials from './Trials';
import AddSetForm from '../AddSetForm';

class TrialSetMainView extends React.Component {
  state = {
    currentContentType: TRIAL_SETS_CONTENT_TYPE,
    selectedTrialSet: null,
  };

  switchCurrentContentType = (contentType) => {
    this.setState({ currentContentType: contentType });
  };

  selectTrialSet = (trialSet) => {
    this.setState({ selectedTrialSet: trialSet });
  };

  renderContent = (contentType) => {
    const { experimentId } = this.props;

    switch (contentType) {
      case TRIAL_SETS_CONTENT_TYPE:
      default:
        return (
          <TrialSets
            experimentId={experimentId}
            changeContentType={this.switchCurrentContentType}
            selectTrialSet={this.selectTrialSet}
          />
        );
      case TRIALS_CONTENT_TYPE:
        return (
          <Trials
            experimentId={experimentId}
            trialSetId={this.state.selectedTrialSet.id}
            backToTrialSets={this.switchCurrentContentType}
          />
        );
      case TRIAL_SET_FORM_CONTENT_TYPE:
        return (
          <AddSetForm
            type={TRIAL_SETS_CONTENT_TYPE}
            experimentId={experimentId}
            changeContentType={this.switchCurrentContentType}
          />
        );
    }
  };

  render() {
    return <>{this.renderContent(this.state.currentContentType)}</>;
  }
}

export default TrialSetMainView;
