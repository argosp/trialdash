import React from 'react';
import PropTypes from 'prop-types';
import { Query, Subscription } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { styles } from './styles';

import trialsQuery from './utils/trialQuery';
import ListOfTrials from './ListOfTrials';
import trialsSubscription from './utils/trialsSubscription';
//MATERIAL UI DEPENDENCIES

const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class TrialMainView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      collection: "",
      arrayOfTrials: [],
      experimentId: "",
      query: true
    };
  }
  componentWillMount() {
    //this.trialUpdatedSubscription()
  }
  componentDidMount() {
    console.log(this.state)
  }
  executeQuery = () => this.setState((prevState) => ({ query: !prevState.query }));

  handleChangeTab = (event, value) => {
    this.setState({ value });
  };
  render() {
    const { classes } = this.props;
    const { value } = this.state;
    let queryRefecth = null;
    return (
      <div className={classes.root}>
        <Paper square>
          <Tabs
            value={value}
            onChange={this.handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Trials list" disabled={this.props.experimentId === null} />
            {/* <Tab label="+" disabled={this.props.experimentId === null} /> */}
          </Tabs>
        </Paper>
        <Query
          query={trialsQuery(this.props.experimentId)}
        >
          {
            ({ loading, error, data, refetch }) => {
              let loadingTxt = this.state.value === 0 ? 'loading...' : '';
              if (loading) return <p style={{'textAlign': 'left'}}>{loadingTxt}</p>;
              if (error) {
                if(this.state.value === 0)
                  return <p style={{ 'textAlign': 'left' }}> No trials to show</p>;
                return <p/>;
              }
              queryRefecth = refetch;
              return (
                <div>
                  {value === 0 &&
                    <TabContainer>
                      <ListOfTrials
                        experimentId={this.props.experimentId}
                        trials={data.trials}
                        devices={data.devices} />
                    </TabContainer>}
                </div>
              )
            }
          }
        </Query>
        <Subscription
            subscription={trialsSubscription}>
            {({ data, loading }) => {
              if (data && data.trialsUpdated) 
              queryRefecth !== null && queryRefecth();
              return null
            }}
        </Subscription>
        {/* <Query
          query={devicesQuery(this.props.experimentId, 'device')}
        >
          {
            ({ loading, error, data, refetch }) => {
              if (this.state.value === 1 && (this.props.experimentId == null || this.props.experimentId === ''))
                return <p style={{color: 'red', 'textAlign': 'left'}}>Please select an experiment first</p>;
              if (loading) return <p></p>;
              if (error) return;
              return (
                <div>
                  {value === 1 &&
                    <TabContainer>
                      { this.props.experimentId != null && this.props.experimentId !== '' ?
                      <TrialForm
                        experimentId={this.props.experimentId}
                        devices={data.devices}
                        showAll={() => this.setState({ value: 1 })}
                        /> : null }
                    </TabContainer>}

                </div>
              )
            }
          }
        </Query> */}
      </div>
    );
  }
}

TrialMainView.propTypes = {
  classes: PropTypes.object.isRequired,
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


export default withStyles(styles)(TrialMainView);

