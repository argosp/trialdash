import React from 'react';
import { Query, Subscription } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { styles } from './styles';
import trialSetsQuery from './utils/trialSetQuery';
// import TrialSetForm from './TrialSetForm';
import ListOfTrialSets from './ListOfTrialSets';
import trialSetsSubscription from './utils/trialSetsSubscription';
import ContentHeader from '../ContentHeader';

const TabContainer = props => (
  <Typography component="div" style={{ padding: 8 * 3 }}>
    {props.children}
  </Typography>
);

class TrialSetMainView extends React.PureComponent {
  render() {
    let queryRefetch = null;

    return (
      <div>
        <ContentHeader
          title="Trial sets"
          searchPlaceholder="Search trial sets"
          addButtonText="Add trial set"
        />
        <Query
          query={trialSetsQuery(this.props.experimentId)}
        >
          {
              ({ loading, error, data, refetch }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p> No trialSets to show</p>;
                queryRefetch = refetch;
                return (
                  <div>
                    <TabContainer>
                      <ListOfTrialSets
                        trialSets={data.trialSets}
                        experimentId={this.props.experimentId}
                      />
                    </TabContainer>
                    {/* {value === 1 &&
                    <TabContainer>
                        <TrialSetForm
                          experimentId={this.props.experimentId}
                          showAll={() => this.setState({ value: 1 })}
                        />
                    </TabContainer>} */}
                  </div>
                );
              }
            }
        </Query>
        <Subscription
          subscription={trialSetsSubscription}
        >
          {({ data, loading }) => {
            if (data && data.trialSetsUpdated) { queryRefetch !== null && queryRefetch(); }
            return null;
          }}
        </Subscription>
      </div>
    );
  }
}

export default withStyles(styles)(TrialSetMainView);
