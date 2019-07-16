import React from 'react';
import PropTypes from 'prop-types';
import { styles } from './styles';
import experimentsQuery from '../../ExperimentContext/utils/experiments-query';
import trialsSetsQuery from '../../TrialSetContext/utils/trialSetQuery';
import devicesQuery from '../../DeviceContext/utils/deviceQuery';
import config from '../../../config';
import trialMutation from './utils/trialMutation';
import Graph from '../../../apolloGraphql';
import LeafLetMap from '../LeafLetMap';

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
        let properties = props.properties || [];
        if (props.trialSet && props.trialSet.properties) {
            props.trialSet.properties.forEach(p => {
                let property = properties.find(pr => pr.key === p.key);
                if (property) property.type = p.val;
                else properties.push({ key: p.key, val: '', type: p.val });
            });
        }
        this.state = {
            expanded: null,
            experiments: [],
            experimentId: props.experimentId,
            devicesList: props.devices || [],
            device: props.device,
            id: props.id || '',
            name: props.name || '',
            begin: props.begin || null,
            end: props.end || null,
            trialSet: props.trialSet,
            properties: properties,
            errors: {}
        };
    }

    handleChangeMultiple = key => event => {
        let properties = this.state.properties;
        if (key === 'trialSet' && event && event.target.value.properties) {
            properties = event.target.value.properties.map(p => { return({ key: p.key, val: '', type: p.val })})
        }
        this.setState({
            [key]: event.target.value,
            properties
        });
    }

    componentDidMount() {
        graphql.sendQuery(trialsSetsQuery(this.props.experimentId))
          .then(data => {
            this.setState(() => ({
              trialSetsList: data.trialSets
            }));
          })
          .then(() => {
            setTimeout(() => {
              this.setState(() => ({ timeout: true }))
            }, 5000)
          })

        graphql.sendQuery(devicesQuery(this.props.experimentId, 'device'))
          .then(data => {
            this.setState(() => ({
              devicesList: data.devices
            }));
          })
          .then(() => {
            setTimeout(() => {
              this.setState(() => ({ timeout: true }))
            }, 5000)
          })
    }


    handleChange = key => event => {
        this.setState({
            [key]: event.target.value,
        });
    };

    handleChangeProprty = (index, key) => event => {
        this.state.properties[index][key] = event.target.value;
        this.setState({ });
    };

    submitTrial = () => {
        this.setState({errors: {}});
        const errors = {};
        let e = false;
        if (!this.state.id || this.state.id.trim() === '') {
            errors.id = true;
            e = true;
        }
        if (!this.state.trialSet || !this.state.trialSet.id) {
            errors.trialSet = true;
            e = true;
        }
        if (e) {
            this.setState({ errors: errors });
            return;
        }
        const newTrial = {
            id: this.state.id,
            name: this.state.name,
            begin: this.state.begin,
            end: this.state.end,
            trialSet: this.state.trialSet.id,
            properties: this.state.properties.map(p => {return({ key: p.key, val: p.val })}),
            device: this.state.device ? this.state.device.id : null,
            experimentId: this.state.experimentId
        };

        let _this = this;

        graphql.sendMutation(trialMutation(newTrial))
            .then(data => {
                window.alert(`saved trial ${data.addUpdateTrial.id}`);
                _this.props.showAll();
            })
            .catch(err => {
                window.alert(`error: ${err}`);
            });
    }

    render() {

        return (
            <form className={classes.container}  noValidate autoComplete="off" style={{ display: 'flex', textAlign: 'left' }}>
                <div>
                    <TextField style={{ width: '300px' }}
                        error={this.state.errors.id}
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
                        id="begin"
                        label="Begin"
                        type="date"
                        className={classes.textField}
                        value={this.state.begin}
                        onChange={this.handleChange('begin')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <br />
                    <TextField style={{ width: '300px', 'marginTop': '30px' }}
                        id="end"
                        label="End"
                        type="date"
                        className={classes.textField}
                        value={this.state.end}
                        onChange={this.handleChange('end')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <br />
                    <FormControl className={classes.formControl} style={{ width: '300px', 'marginTop': '30px' }}>
                        <InputLabel htmlFor="select-multiple-chip">Trial Set</InputLabel>
                        <Select
                            error={this.state.errors.trialSet}
                            value={this.state.trialSet}
                            onChange={this.handleChangeMultiple('trialSet')}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={selected => (<Chip label={selected.id} className={classes.chip} />)}
                            MenuProps={MenuProps}
                        >
                            {this.state.trialSetsList && this.state.trialSetsList.map(ts => (
                                <MenuItem key={ts.id} value={ts}>
                                    {ts.id}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <br />
                    <h3>properties:</h3>
                    {this.state.properties.map((p, i) => {
                        return <div key={i} style={{display: 'flex'}}>
                            <TextField style={{ width: '300px' }}
                                type={p.type}
                                label={p.key}
                                className={classes.textField}
                                value={p.val}
                                onChange={this.handleChangeProprty(i, 'val')}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <br />
                        </div>
                    })}
                    <FormControl className={classes.formControl} style={{ width: '300px', 'marginTop': '30px' }}>
                        <InputLabel htmlFor="select-multiple-chip">Device</InputLabel>
                        <Select
                            // multiple
                            value={this.state.device}
                            onChange={this.handleChangeMultiple('device')}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={selected => (<Chip label={selected.name} className={classes.chip} />)}
                            MenuProps={MenuProps}
                        >
                            {this.state.devicesList.map(device => (
                                <MenuItem key={device.id} value={device}>
                                    {device.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <div style={{ 'marginTop': '50px', textAlign: 'center', display: 'flex' }}>
                            <Button variant="contained" className={classes.button} style={{ width: '180px' }}
                                onClick={this.submitTrial}
                            >
                                Submit
                            </Button>
                            {this.props.cancel && <Button variant="contained" className={classes.button} style={{ width: '180px' }}
                                onClick={this.props.showAll}
                            >
                                Cancel
                            </Button>}
                        </div>
                    </FormControl>

                </div>
                {/* {this.state.device && this.state.device.position && <LeafLetMap position={this.state.device.position.split(',')}/>} */}
            </form>
        );
    }
}

TrialForm.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withTheme(TrialForm);