import React from 'react';
import PropTypes from 'prop-types';
import { styles } from './styles';
import experimentsQuery from '../../ExperimentContext/utils/experiments-query';
import config from '../../../config';
import assetMutation from './utils/assetMutation';
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

function getStyles(asset, assets, theme) {
    return {
        fontWeight:
            assets.indexOf(asset) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

class AssetForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            type: ''
        };
    }

    componentDidMount() {
    }


    handleChange = key => event => {
        this.setState({
            [key]: event.target.value,
        });
    };


    submitAsset = () => {
        const newAsset = {
            id: this.state.id,
            experimentId: this.props.experimentId,
            name: this.state.name,
            type: this.state.type
        };

        graphql.sendMutation(assetMutation(newAsset))
            .then(data => {
                window.alert(`saved asset ${data.addUpdateAsset.id}`);
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
                <div style={{ 'marginTop': '50px', textAlign: 'center' }}>
                    <Button variant="contained" className={classes.button} style={{ width: '180px' }}
                        onClick={this.submitAsset}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        );
    }
}

AssetForm.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withTheme(AssetForm);