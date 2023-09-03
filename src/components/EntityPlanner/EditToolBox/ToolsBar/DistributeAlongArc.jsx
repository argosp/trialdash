import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { Button } from './Button';
import processingDecimalDigits from '../../utils/processingDecimalDigits.js';

const DistributeAlongArc = ({ classes, onSubmit, markedPoints }) => {
  const labels = [
    'center',
    'radius',
    'arc',
  ];
  const subset = markedPoints.filter((p, i) => i < 2 || i == markedPoints.length - 1);
  const positions = labels.map((label, i) => {
    const p = subset[i];
    const x = p ? processingDecimalDigits(p[0]) : '';
    const y = p ? processingDecimalDigits(p[1]) : '';
    return { label, x, y };
  })

  return (
    <Grid container className={classes.tool}>
      {positions.map((point, index) => (
        <Grid item className="toolItem" key={index}>
          <Grid item md={1}>
            <Typography component="span">{positions[index].label}</Typography>
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
      {/* <Button className="button" text="distribute" onClick={onSubmit} /> */}
    </Grid>
  );
};

export default DistributeAlongArc;
