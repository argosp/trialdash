import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import {
  TRIAL_SETS_CONTENT_TYPE,
  TRIALS_CONTENT_TYPE,
  TRIAL_SET_FORM_CONTENT_TYPE,
} from '../../constants/base';
import TrialSets from './TrialSets';
import Trials from './Trials';
import TrialSetForm from './TrialSetForm';

class TrialSetMainView extends React.Component {
  state = {
    currentContentType: TRIAL_SETS_CONTENT_TYPE,
  };

  switchCurrentContentType = (contentType) => {
    this.setState({ currentContentType: contentType });
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
          />
        );
      case TRIALS_CONTENT_TYPE:
        return (
          <Trials
            experimentId={experimentId}
            backToTrialSets={this.switchCurrentContentType}
          />
        );
      case TRIAL_SET_FORM_CONTENT_TYPE:
        return (
          <TrialSetForm changeContentType={this.switchCurrentContentType} />
        );
    }
  };

  render() {
    return <>{this.renderContent(this.state.currentContentType)}</>;
  }
}

export default withStyles(styles)(TrialSetMainView);
