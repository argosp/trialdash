import { Grid, TextField, Typography } from '@material-ui/core';
import React from 'react';
import processingDecimalDigits from '../../../../utils/processingDecimalDigits';
import { Button } from './Button';

const Curve = ({ classes, onSubmit, markedPoints }) => {
  const positions = [{ x: '', y: '' }];
  if (markedPoints.length > 0) {
    markedPoints.forEach((markedPoint, index) => {
      const point = { x: markedPoint[0], y: markedPoint[1] };
      positions[index] = {
        x: processingDecimalDigits(point.x),
        y: processingDecimalDigits(point.y),
      };
    });
  }
  return (
    <Grid container className={classes.tool}>
      {positions.map((point, index) => (
        <Grid item className="toolItem" key={index}>
          <Grid item md={1}>
            <Typography component="span">{index + 1}</Typography>
          </Grid>
          <Grid item md={4}>
            <TextField
              InputProps={{ style: { fontSize: 14 } }}
              id="x-input"
              label="x"
              value={point.x}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item md={4}>
            <TextField
              InputProps={{ style: { fontSize: 14 } }}
              id="y-input"
              label="y"
              value={point.y}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      ))}
      <Button className="button" text="distribute" onClick={onSubmit} />
    </Grid>
  );
};

export default Curve;
