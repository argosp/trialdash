import React from 'react';
import {
  TRIAL_SETS_CONTENT_TYPE,
  TRIALS_CONTENT_TYPE,
  TRIAL_SET_FORM_CONTENT_TYPE,
  TRIAL_FORM_CONTENT_TYPE,
} from '../../constants/base';
import TrialSets from './TrialSets';
import Trials from './Trials';
import AddSetForm from '../AddSetForm';
import TrialForm from './TrialForm';

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
    const { selectedTrialSet } = this.state;

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
            trialSetKey={selectedTrialSet.key}
            changeContentType={this.switchCurrentContentType}
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
      case TRIAL_FORM_CONTENT_TYPE:
        return (
          <TrialForm
            experimentId={experimentId}
            trialSet={selectedTrialSet}
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
