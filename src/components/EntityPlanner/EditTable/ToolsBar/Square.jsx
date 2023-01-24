import React from 'react';
import { Button } from './Button';
import { Grid } from '@material-ui/core';

const Square = ({ classes, onSubmit }) => {
  return (
    <Grid
      container
      // className={classes.tool}
      style={{ display: 'flex', flexDirection: 'column' }}>
      <Button className="button" text="distribute" onClick={onSubmit} />
    </Grid>
  );
};

export default Square;
