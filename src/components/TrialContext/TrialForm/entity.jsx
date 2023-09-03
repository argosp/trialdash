import React from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// import LeafLetMap from '../../TrialContext/LeafLetMap';

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

const Entity = props => (
  <div>
    <h3>{props.entityName}:</h3>
    <InputLabel htmlFor="select-multiple-chip">+ Add {props.entityName}</InputLabel>
    <Select
      value={props.entities}
      onChange={props.handleChangeMultiple(props.entityName)}
      MenuProps={MenuProps}
    >
      {props.entitiesList.map(entity => (
        <MenuItem key={entity.id} value={entity}>
          {entity.name}
        </MenuItem>
      ))}
    </Select>
    {props.entities.map((d, index) => (
      <div key={d.entity.id}>
        <div>{d.name}</div>
        <div>
          {d.properties
            && d.properties.map((p, i) => {
              if (p.type === 'location') {
                // return (
                //   <LeafLetMap
                //     onChange={props.handleChangeProprty(i, 'val')}
                //     location={p.val && p.val !== '' ? p.val.split(',') : [0, 0]}
                //   />
                // );
              }
              return (
                // TODO Add id field into p
                <div key={p.id} style={{ display: 'flex' }}>
                  <TextField
                    style={{ width: '300px' }}
                    type={p.type}
                    label={p.key}
                    value={p.val}
                    onChange={props.handleChangeProprty(
                      i,
                      'val',
                      props.entityName,
                      index,
                    )}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <br />
                </div>
              );
            })}
        </div>
        <button
          type="button"
          onClick={() => props.removeEntity(props.entityName, d.entity.id, d.name)
          }
        >
          X
        </button>
      </div>
    ))}
  </div>
);

export default Entity;
