import React from 'react';
import PropTypes from 'prop-types';
import { Query, Subscription } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { styles } from './styles';

import dataQuery from './utils/dataQuery';
import DataForm from './DataForm';
import dataSubscription from './utils/dataSubscription';
//MATERIAL UI DEPENDENCIES

const TabContainer = (props) => {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  }

class DataMainView extends React.PureComponent {
constructor(props){
    super(props);
    this.state = {
        value: 0,
        collection:"",
        data:[],
        query: true
      };
}
componentWillMount(){
  //this.dataUpdatedSubscription()
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
        <Query
            query={dataQuery(this.props.experimentId)}
            >
            {
              ({ loading, error, data, refetch }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p> No data to show</p>;
                queryRefecth = refetch;
                return (
                  <div>
                        <DataForm
                          experimentId={this.props.experimentId}
                          {...data.experimentData}
                        />

                  </div>
                )
                }
            }
        </Query>
        <Subscription
            subscription={dataSubscription}>
            {({ data, loading }) => {
              if (data && data.experimentDataUpdated) 
              queryRefecth !== null && queryRefecth();
              return null
            }}
        </Subscription>
      </div>
    );
  }
}

DataMainView.propTypes = {
  classes: PropTypes.object.isRequired,
};

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};
  

export default withStyles(styles)(DataMainView);

