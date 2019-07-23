import React from 'react';
import PropTypes from 'prop-types';
import LeafLetMap from '../LeafLetMap';

import classes from './styles';
//MATERIAL UI DEPENDENCIES
import { withTheme } from '@material-ui/core/styles';

// import { withTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


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

class Entity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entities: props.entities || []
        };
    }

    render() {

        return (
                <div>
                    <h3>{this.props.entityName}:</h3>
                        <InputLabel htmlFor="select-multiple-chip">+ Add {this.props.entityName}</InputLabel>
                        <Select
                            value={this.props.entities}
                            onChange={this.props.handleChangeMultiple(this.props.entityName)}
                            MenuProps={MenuProps}
                        >
                            {this.props.entitiesList.map(entity => (
                                <MenuItem key={entity.id} value={entity}>
                                    {entity.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {this.props.entities.map((d, index) => {
                            return <div key={index} style={classes.entity} >
                                <div>{d.entity.name}</div>
                                <div style={classes.properties}>
                                    {d.properties.map((p, i) => {
                                        if(p.type === 'location') return <LeafLetMap onChange={this.props.handleChangeProprty(i, 'val')} location={p.val && p.val !== '' ? p.val.split(',') : [0, 0]}/>
                                        else
                                            return <div key={i} style={{display: 'flex'}}>
                                                <TextField style={{ width: '300px' }}
                                                    type={p.type}
                                                    label={p.key}
                                                    className={classes.textField}
                                                    value={p.val}
                                                    onChange={this.props.handleChangeProprty(i, 'val', this.props.entityName, index)}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                                <br />
                                            </div>
                                    })}
                                </div>
                                <div onClick={() => this.props.removeEntity(this.props.entityName, d.entity.id)}>X</div>
                            </div>
                        })}
                    

                </div>
        );
    }
}

Entity.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withTheme(Entity);