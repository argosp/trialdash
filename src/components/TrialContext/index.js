import React from 'react';
import { Query, Subscription } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import trialsQuery from './utils/trialQuery';
import ListOfTrials from './ListOfTrials';
import trialsSubscription from './utils/trialsSubscription';

class TrialMainView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  render() {
    const { value } = this.state;
    let queryRefetch = null;
    return (
      <div>
        <Query query={trialsQuery(this.props.experimentId)}>
          {({ loading, error, data, refetch }) => {
            const loadingTxt = this.state.value === 0 ? 'loading...' : '';
            if (loading) {
              return <p style={{ textAlign: 'left' }}>{loadingTxt}</p>;
            }
            if (error) {
              if (this.state.value === 0) {
                return <p style={{ textAlign: 'left' }}> No trials to show</p>;
              }
              return <p />;
            }
            queryRefetch = refetch;
            return (
              <div>
                {value === 0 && (
                  <ListOfTrials
                    experimentId={this.props.experimentId}
                    trials={data.trials}
                    devices={data.devices}
                  />
                )}
              </div>
            );
          }}
        </Query>
        <Subscription subscription={trialsSubscription}>
          {({ data, loading }) => {
            if (data && data.trialsUpdated) {
              queryRefetch !== null && queryRefetch();
            }
            return null;
          }}
        </Subscription>
        {/*        <Query query={devicesQuery(this.props.experimentId, 'device')}>
          {({ loading, error, data, refetch }) => {
            if (
              this.state.value === 1
              && (this.props.experimentId == null
                || this.props.experimentId === '')
            ) {
              return (
                <p style={{ color: 'red', textAlign: 'left' }}>
                  Please select an experiment first
                </p>
              );
            }
            if (loading) return <p />;
            if (error) return;
            return (
              <div>
                {value === 1 && (
                  <TabContainer>
                    {this.props.experimentId != null
                    && this.props.experimentId !== '' ? (
                      <TrialForm
                        experimentId={this.props.experimentId}
                        devices={data.devices}
                        showAll={() => this.setState({ value: 1 })}
                      />
                      ) : null}
                  </TabContainer>
                )}
              </div>
            );
          }}
        </Query> */}
      </div>
    );
  }
}

export default withStyles(styles)(TrialMainView);
