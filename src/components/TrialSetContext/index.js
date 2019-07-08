import React from 'react';
import PropTypes from 'prop-types';
import { Query, Subscription } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { styles } from './styles';

import trialSetsQuery from './utils/trialSetQuery';
import TrialSetForm from './TrialSetForm';
import ListOfTrialSets from './ListOfTrialSets';
import trialSetsSubscription from './utils/trialSetsSubscription';
//MATERIAL UI DEPENDENCIES

const TabContainer = (props) => {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  }

class TrialSetMainView extends React.PureComponent {
constructor(props){
    super(props);
    this.state = {
        value: 0,
        collection:"",
        trialSets:[],
        query: true
      };
}
componentWillMount(){
  //this.trialSetUpdatedSubscription()
}
componentDidMount(){

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
            <Tab label="TrialSets list" />
            <Tab label="+"/>
          </Tabs>
        </Paper>
        <Query
            query={trialSetsQuery(this.props.experimentId)}
            >
            {
              ({ loading, error, data, refetch }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p> No trialSets to show</p>;
                queryRefecth = refetch;
                return (
                  <div>
                  {value === 0 && 
                    <TabContainer>
                        <ListOfTrialSets
                          trialSets={data.trialSets}
                          experimentId={this.props.experimentId}
                        />
                    </TabContainer>}
                    {value === 1 && 
                    <TabContainer>
                        <TrialSetForm
                          experimentId={this.props.experimentId}
                        />
                    </TabContainer>}

                  </div>
                )
                }
            }
        </Query>
        <Subscription
            subscription={trialSetsSubscription}>
            {({ data, loading }) => {
              if (data && data.trialSetsUpdated) 
              queryRefecth !== null && queryRefecth();
              return null
            }}
        </Subscription>
      </div>
    );
  }
}

TrialSetMainView.propTypes = {
  classes: PropTypes.object.isRequired,
};

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};
  

export default withStyles(styles)(TrialSetMainView);

