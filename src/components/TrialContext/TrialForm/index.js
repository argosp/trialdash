import React from 'react';
import PropTypes from 'prop-types';
import { styles } from './styles';
import experimentsQuery from '../../ExperimentContext/utils/experiments-query';
import config from '../../../config';
import trialMutation from './utils/trialMutation';
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

class TrialForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: null,
            experiments: [],
            experimentId: props.experimentId,
            devicesList: props.devices,
            devices: [],
            devicesSelected: [],
            id: '',
            name: '',
            begin: '',
            end: '',
        };
    }

    handleChangeMultiple = key => event => {
        this.setState({
            [key]: event.target.value
        });
    }

    componentDidMount() {
    }


    handleChange = key => event => {
        this.setState({
            [key]: event.target.value,
        });
    };


    submitTrial = () => {
        const newTrial = {
            id: this.state.id,
            name: this.state.name,
            begin: this.state.begin,
            end: this.state.end,
            devices: this.state.devices,
            experimentId: this.state.experimentId
        };

        graphql.sendMutation(trialMutation(newTrial))
            .then(data => {
                window.alert(`saved trial ${data.addUpdateTrial.id}`);
            })
            .catch(err => {
                window.alert(`error: ${err}`);
            });
    }

    render() {

        return (
            <form className={classes.container}  noValidate autoComplete="off" style={{ textAlign: 'left' }}>
                <TextField style={{ width: '300px' }}
                    id="id"
                    label="ID"
                    className={classes.textField}
                    value={this.state.id}
                    onChange={this.handleChange('id')}
                />
                <br />
                <TextField style={{ width: '300px', 'margin-top': '30px' }}
                    id="name"
                    label="Name"
                    className={classes.textField}
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                />
                <br />
                <TextField style={{ width: '300px', 'margin-top': '30px' }}
                    id="begin"
                    label="Begin"
                    className={classes.textField}
                    value={this.state.begin}
                    onChange={this.handleChange('begin')}
                />
                <br />
                <TextField style={{ width: '300px', 'margin-top': '30px' }}
                    id="end"
                    label="End"
                    className={classes.textField}
                    value={this.state.end}
                    onChange={this.handleChange('end')}
                />
                <br />
                <FormControl className={classes.formControl} style={{ width: '300px', 'margin-top': '30px' }}>
                    <InputLabel htmlFor="select-multiple-chip">Devices</InputLabel>
                    <Select
                        multiple
                        value={this.state.devices}
                        onChange={this.handleChangeMultiple('devices')}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={selected => (
                            <div className={classes.chips}>
                                {selected.map(value => (
                                    <Chip key={value} label={value} className={classes.chip} />
                                ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                    >
                        {this.state.devicesList.map(device => (
                            <MenuItem key={device} value={device} style={getStyles(device, this.state.devices, this.props.theme)}>
                                {device}
                            </MenuItem>
                        ))}
                    </Select>
                    <div style={{ 'margin-top': '50px', textAlign: 'center' }}>
                        <Button variant="contained" className={classes.button} style={{ width: '180px' }}
                            onClick={this.submitTrial}
                        >
                            Submit
                    </Button>
                    </div>
                </FormControl>
            </form>
        );
    }
}

TrialForm.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withTheme(TrialForm);