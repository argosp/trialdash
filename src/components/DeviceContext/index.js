import React from 'react';
import PropTypes from 'prop-types';
import { Query, Subscription } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { styles } from './styles';

import devicesQuery from './utils/deviceQuery';
import DeviceForm from './DeviceForm';
import ListOfDevices from './ListOfDevices';
import devicesSubscription from './utils/devicesSubscription';
//MATERIAL UI DEPENDENCIES

const TabContainer = (props) => {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  }

class DeviceMainView extends React.PureComponent {
constructor(props){
    super(props);
    this.state = {
        value: 0,
        collection:"",
        devices:[],
        query: true
      };
}
componentWillMount(){
  //this.deviceUpdatedSubscription()
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
            <Tab label="Devices list" />
            <Tab label="+"/>
          </Tabs>
        </Paper>
        <Query
            query={devicesQuery()}
            >
            {
              ({ loading, error, data, refetch }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p> No devices to show</p>;
                queryRefecth = refetch;
                return (
                  <div>
                  {value === 0 && 
                    <TabContainer>
                        <ListOfDevices
                            devices={data.devices}/>
                    </TabContainer>}
                    {value === 1 && 
                    <TabContainer>
                        {/* <DeviceForm
                            collection={data.devices.length === 1? data.devices[0].id : ""}/> */}
                    </TabContainer>}

                  </div>
                )
                }
            }
        </Query>
        <Subscription
            subscription={devicesSubscription}>
            {({ data, loading }) => {
              if (data && data.devicesUpdated) 
              queryRefecth !== null && queryRefecth();
              return null
            }}
        </Subscription>
      </div>
    );
  }
}

DeviceMainView.propTypes = {
  classes: PropTypes.object.isRequired,
};

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};
  

export default withStyles(styles)(DeviceMainView);

