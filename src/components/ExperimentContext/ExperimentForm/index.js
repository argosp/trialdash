import React from 'react';
import PropTypes from 'prop-types';
import experimentMutation from './utils/experimentMutation';
import Graph from '../../../apolloGraphql';

import classes from './styles';
//MATERIAL UI DEPENDENCIES
import { withTheme } from '@material-ui/core/styles';

// import { withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

const graphql = new Graph();

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             width: 250,
//         },
//     },
// };

// const useStyles = makeStyles(theme => ({
//     root: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     formControl: {
//         margin: theme.spacing(1),
//         minWidth: 300,
//         maxWidth: 300,
//     },
//     chips: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     chip: {
//         margin: 2,
//     },
//     noLabel: {
//         marginTop: theme.spacing(3),
//     },
//     button: {
//         margin: theme.spacing(1),
//     },
//     input: {
//         display: 'none',
//     }
// }));

// function getStyles(device, devices, theme) {
//     return {
//         fontWeight:
//             devices.indexOf(device) === -1
//                 ? theme.typography.fontWeightRegular
//                 : theme.typography.fontWeightMedium,
//     };
// }

class ExperimentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: null,
            id: props.id || '',
            name: props.name || '',
            begin: props.begin,
            end: props.end,
            errors: {}
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


    submitExperiment = () => {
        this.setState({errors: {}});
        if (!this.state.name || this.state.name.trim() === '') {
            this.setState({errors: {name: true}});
            return;
        }
        const newExperiment = {
            // id: this.state.id,
            name: this.state.name,
            begin: this.state.begin,
            end: this.state.end
        };

        let _this = this;

        graphql.sendMutation(experimentMutation(newExperiment))
            .then(data => {
                window.alert(`saved experiment ${data.addUpdateExperiment.id}`);
                if (_this.props.close) _this.props.close();
            })
            .catch(err => {
                window.alert(`error: ${err}`);
            });
    }

    render() {

        return (
            <form className={classes.container}  noValidate autoComplete="off" style={{
                textAlign: 'left',
                position: 'absolute',
                padding: '70px',
                marginLeft: '240px',
                zIndex: 999,
                background: '#FFFFFF',
                height: '100%',
                width: 'calc(100% - 240px)' }}>
                <div>
                    {/* <TextField style={{ width: '300px' }}
                        error={this.state.errors.id}
                        id="id"
                        label="ID"
                        className={classes.textField}
                        value={this.state.id}
                        onChange={this.handleChange('id')}
                    />
                    <br /> */}
                    <TextField style={{ width: '300px', 'marginTop': '30px' }}
                        id="name"
                        label="Name"
                        error={this.state.errors.name}
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
                </div>  
                <FormControl className={classes.formControl} style={{ width: '300px', 'marginTop': '30px' }}>
                        <div style={{ 'marginTop': '50px', textAlign: 'center', display: 'flex' }}>
                            <Button variant="contained" className={classes.button} style={{ width: '180px' }}
                                onClick={this.submitExperiment}
                            >
                                Submit
                            </Button>
                            {this.props.close && <Button variant="contained" className={classes.button} style={{ width: '180px' }}
                                onClick={this.props.close}
                            >
                                Cancel
                            </Button>}
                        </div>
                    </FormControl>               
            </form>
        );
    }
}

ExperimentForm.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withTheme(ExperimentForm);