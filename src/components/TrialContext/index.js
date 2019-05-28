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
import TrialForm from './TrialForm';
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
constructor(props){
    super(props);
    this.state = {
        value: 0,
        collection:"",
        arrayOfTrials:[],
        experimentId:"",
        query: true
      };
}
componentWillMount(){
  //this.trialUpdatedSubscription()
}
componentDidMount(){
  console.log(this.state)
}
executeQuery = () => this.setState((prevState)=>({query: !prevState.query}));

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
            <Tab label="+" disabled={this.props.experimentId === null}/>
          </Tabs>
        </Paper>
        <Query
            query={trialsQuery(this.props.experimentId)}
            >
            {
              ({ loading, error, data, refetch }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p> No trials to show</p>;
                queryRefecth = refetch;
                return (
                  <div>
                  {value === 0 && 
                    <TabContainer>
                        <ListOfTrials
                            trials={data.trials}/>
                    </TabContainer>}
                    {value === 1 && 
                    <TabContainer>
                        {/* <TrialForm 
                            experimentId={this.props.experimentId} 
                            collection={data.trials.length === 1? data.trials[0].id : ""}/> */}
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

