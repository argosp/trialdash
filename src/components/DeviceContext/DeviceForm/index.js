import React from 'react';
import PropTypes from 'prop-types';
import { styles } from './styles';
import experimentsQuery from '../../ExperimentContext/utils/experiments-query';
import config from '../../../config';
import deviceMutation from './utils/deviceMutation';
import Graph from '../../../apolloGraphql';

import classes from './styles';
//MATERIAL UI DEPENDENCIES
import { withTheme, makeStyles, useTheme } from '@material-ui/core/styles';

// import { withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

const graphql = new Graph();

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    }
}));

function getStyles(device, devices, theme) {
    return {
        fontWeight:
            devices.indexOf(device) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

class DeviceForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            type: '',
            properties: []                    ,
            position: props.position || '',
        };
    }

    componentDidMount() {
    }


    handleChange = key => event => {
        this.setState({
            [key]: event.target.value,
        });
    };


    submitDevice = () => {
        const newDevice = {
            id: this.state.id,
            name: this.state.name,
            type: this.state.type,
            properties: this.state.properties,
            position: this.state.position
        };

        graphql.sendMutation(deviceMutation(newDevice))
            .then(data => {
                window.alert(`saved device ${data.addUpdateDevice.id}`);
            })
            .catch(err => {
                window.alert(`error: ${err}`);
            });
    }

    render() {

        return (
            <form className={classes.container} noValidate autoComplete="off" style={{ textAlign: 'left' }}>
                <TextField style={{ width: '300px' }}
                    id="id"
                    label="ID"
                    className={classes.textField}
                    value={this.state.id}
                    onChange={this.handleChange('id')}
                />
                <br />
                <TextField style={{ width: '300px', 'marginTop': '30px' }}
                    id="name"
                    label="Name"
                    className={classes.textField}
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                />
                <br />
                <TextField style={{ width: '300px', 'marginTop': '30px' }}
                    id="type"
                    label="Type"
                    className={classes.textField}
                    value={this.state.type}
                    onChange={this.handleChange('type')}
                />
                <br />
                <TextField style={{ width: '300px', 'marginTop': '30px' }}
                    id="position"
                    label="Position"
                    className={classes.textField}
                    value={this.state.position}
                    onChange={this.handleChange('position')}
                />
                <br />
                {/* <TextField style={{ width: '300px', 'marginTop': '30px' }}
                    id="properties"
                    label="Properties"
                    className={classes.textField}
                    value={this.state.properties}
                    onChange={this.handleChange('properties')}
                /> */}
                <br />
                <div style={{ 'marginTop': '50px', textAlign: 'center' }}>
                    <Button variant="contained" className={classes.button} style={{ width: '180px' }}
                        onClick={this.submitDevice}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        );
    }
}

DeviceForm.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withTheme(DeviceForm);