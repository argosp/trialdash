import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { styles } from './styles';

import Devices from '../../DeviceContext';
import Trials from '../../TrialContext';
import Assets from '../../AssetContext';
import Data from '../../DataContext';
import TrialSets from '../../TrialSetContext';

const TabContainer = (props) => {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  }

class MainView extends React.Component {
constructor(props){
    super(props);
    this.state = {
        value: 0,
      };
}
  
componentDidMount(){
}
componentDidUpdate(){
}
handleChangeTab = (event, value) => {
    this.setState({ value });
 };
render() {
    const { classes } = this.props;
    const { value } = this.state;
    if (this.props.id) {
      return (
        <div className={classes.root}>
          <Paper square>
            <Tabs 
              value={value} 
              onChange={this.handleChangeTab}
              indicatorColor="primary"
              textColor="primary"
              >
              {/* <Tab label="Data" disabled={this.props.id === null} /> */}
              <Tab label="Trials" disabled={this.props.id === null} />
              <Tab label="Devices" disabled={this.props.id === null}/>
              <Tab label="Assets" disabled={this.props.id === null}/>
              <Tab label="TrialSets" disabled={this.props.id === null}/>
            </Tabs>
            
          </Paper>
          {/* {value === 0 && <TabContainer><Data experimentId={this.props.id}/></TabContainer>} */}
          {value === 0 && <TabContainer><Trials experimentId={this.props.id}/></TabContainer>}
          {value === 1 && <TabContainer><Devices experimentId={this.props.id} entityType="device"/></TabContainer>}
          {value === 2 && <TabContainer><Assets experimentId={this.props.id} entityType="asset"/></TabContainer>}
          {value === 3 && <TabContainer><TrialSets experimentId={this.props.id}/></TabContainer>}
        </div>
      );
    } else {
      return (
        <div className={classes.root}><Paper square>Select an Experiment Or add a new Experiment</Paper></div>
      );
    }
  }
}

MainView.propTypes = {
  classes: PropTypes.object.isRequired,
};

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};
  

export default withStyles(styles)(MainView);

