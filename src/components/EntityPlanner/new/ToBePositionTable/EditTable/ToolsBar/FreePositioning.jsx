import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import { Button } from './Button';

const FreePositioning = ({ classes, onSubmit }) => {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPos((p) => ({ ...p, [name]: parseFloat(value) }));
  };
  return (
    <Grid container className={classes.tool}>
      <Grid item className="toolItem">
        <TextField
          id="x-input"
          label="x"
          onChange={onChange}
          name="x"
          defaultValue={pos.x}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          id="y-input"
          label="y"
          onChange={onChange}
          name="y"
          defaultValue={pos.y}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Button text="free position" onClick={() => onSubmit(pos)} />
    </Grid>
  );
};

export default FreePositioning;
