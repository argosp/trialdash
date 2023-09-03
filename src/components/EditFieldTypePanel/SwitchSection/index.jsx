import React from 'react';
import { withStyles } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import classnames from 'classnames';
import { styles, switcher } from './styles';

const CustomSwitch = withStyles(switcher)(Switch);

const SwitchSection = ({ title, description, classes, className, onChange, isChecked }) => (
  <Grid
    container
    justifyContent="space-between"
    wrap="nowrap"
    className={classnames(classes.root, className)}
  >
    <Grid item>
      <p className={classes.title}>{title}</p>
      <p className={classes.description}>{description}</p>
    </Grid>
    <Grid item>
      <CustomSwitch
        checked={isChecked || false}
        onChange={(e, switchName) => onChange(e, switchName)}
        inputProps={{ 'aria-label': 'switch' }}
      />
    </Grid>
  </Grid>
);

export default withStyles(styles)(SwitchSection);
