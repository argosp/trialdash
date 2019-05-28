import React from 'react';
import PropTypes from 'prop-types';
import {styles} from './styles';
import uuid from 'uuid/v1';
import config from '../../../config';
import deviceMutation from './utils/deviceMutation';
import Graph from '../../../apolloGraphql';

//MATERIAL UI DEPENDENCIES
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class DeviceForm extends React.Component {
constructor(props){
    super(props);
    this.state = {
        expanded: null,
        id: '',
        name: '',
        type: '',
        properties: []
      };
}
componentDidMount(){
    this.initiateState();
}


initiateState = () => {
}
handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

onInputChange = (e, field, stateName) => {

        //initiate the state name for specific parameter the first time
        //this helps us mapping the dynamic value of the input field
        if(this.state[stateName] === undefined){
            this.setState(()=>({[stateName]:''}))
        }
        const val = e.target.value;

        //take the hole parent object with its params from state
        const parent = this.state[field.parent]
        //update specific field inside the parent object
        parent[field.name] = val;
        //validation
        if(val === "" ||(!isNaN(parseFloat(val)) && val.match(/^\d{1,}(\.\d{0,10})?$/))){
            this.setState({
                [stateName]: val, //set value mapping state
                [field.parent]: parent //set updated parent state
            });
        }
        else return;
    }
submitDevice = () => {
    // const { objectiveTypes } = this.state;
    const { uid, experimentId, collection } = this.props;
    const deviceCustomId = uuid();
    const objectives = []
    ////////////////////////////////////////
    // objectiveTypes.forEach(type => {
    //     let objective = this.state[type];
    //     let isValid = true;
    //     Object.values(objective).forEach(o => {if(o === "") isValid = false})
    //     if(isValid){
    //     objective.objectiveCustomId = uuid();
    //     objective.objectiveCustomType = type;
    //     objective.experimentId = experimentId;
    //     objectives.push(objective)
    //     }
    // })
    ////////////////////////////////////////

    const device = {}
    //     uid,
    //     id,
    //     name,
    //     type,
    //     properties
    // }
const graph = new Graph();
graph.sendMutation(deviceMutation(device))
.then(data => { 
    device.objectives = [];
    device.id = data.InsertDevice.id
    const last = objectives.length - 1;
 })

}
render() {
    const { classes } = this.props;
    return (
        <div className={classes.root}> 
        <form className={classes.form} autoComplete="off">
            {this.state.objectiveTypeHeaders.map((type, index) => (
            <ExpansionPanel 
                key={index}
                expanded={this.state.expanded === type.replace(/\s/g, "")} 
                onChange={this.handleChange(type.replace(/\s/g, ""))}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{type}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                {/* {objectiveStateBuilder[index].map((field, index) => {
                    const stateName = field.parent + '_' + field.name;
                    return (<TextField
                            key={index}
                            label={field.label}
                            id={field.id}
                            placeholder={field.placeholder}
                            className={classes.textField}
                            margin="normal"
                            name={field.name}
                            value={this.state[stateName]||''}
                            onChange={(e) => this.onInputChange(e,field,stateName)}
                        />)
            })} */}
            </ExpansionPanelDetails>
          </ExpansionPanel>
            ))}
            <Button 
                variant="outlined" 
                color="primary" 
                className={classes.button}
                onClick={this.submitDevice}
                disabled={this.props.collection === ''}
            >
                Submit
            </Button>
        </form>
        </div>
    );
  }
}

DeviceForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeviceForm);