import React from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';
import { Button } from './Button';
import processingDecimalDigits from '../../utils/processingDecimalDigits.js';

const DistributeAlongLine = ({ classes, onSubmit, markedPoints }) => {
  const points = Array.from({ ...markedPoints, length: Math.max(2, markedPoints.length) });
  const positions = points.map((p, i) => {
    const x = p ? processingDecimalDigits(p[0]) : '';
    const y = p ? processingDecimalDigits(p[1]) : '';
    const label = (i === 0) ? "start" : ((i === points.length - 1) ? "end" : (i + 1));
    return { label, x, y };
  })

  return (
    <Grid container className={classes.tool}>
      {positions.map((point, index) => (
        <Grid item className="toolItem" key={index}>
          <Grid item md={1}>
            <Typography component="span">{point.label}</Typography>
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

export default DistributeAlongLine;
