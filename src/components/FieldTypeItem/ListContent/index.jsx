import React from 'react';
import { withStyles } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import Radio from '@mui/material/Radio';
import {
  FIELD_TYPE_ITEM_CHECKBOX_TYPE,
  FIELD_TYPES_ICONS,
} from '../../../constants/fieldTypes';
import { styles } from './styles';

const ListContent = ({
  fieldType,
  classes,
  contentType,
}) => (
  <div>
    <Grid container alignItems="center">
      {FIELD_TYPES_ICONS[fieldType.type]}
      <span className={classes.title}>{fieldType.title}</span>
    </Grid>
    <p className={classes.description}>{fieldType.description}</p>
    {contentType === FIELD_TYPE_ITEM_CHECKBOX_TYPE ? (
      <FormGroup>
        <FormControlLabel
          classes={{ label: classes.label, root: classes.labelRoot }}
          control={(
            <Checkbox
              color="default"
              className={classes.itemWrapper}
              icon={
                <CheckBoxOutlineBlankIcon className={classes.wrapperIcon} />
              }
              checkedIcon={
                <CheckBoxOutlinedIcon className={classes.checkedIcon} />
              }
              disableRipple
            />
          )}
          label="Sensor"
        />
        <FormControlLabel
          classes={{ label: classes.label, root: classes.labelRoot }}
          control={(
            <Checkbox
              color="default"
              className={classes.itemWrapper}
              icon={
                <CheckBoxOutlineBlankIcon className={classes.wrapperIcon} />
              }
              checkedIcon={
                <CheckBoxOutlinedIcon className={classes.checkedIcon} />
              }
              disableRipple
            />
          )}
          label="Sensor"
        />
        <FormControlLabel
          classes={{ label: classes.label, root: classes.labelRoot }}
          control={(
            <Checkbox
              color="default"
              className={classes.itemWrapper}
              icon={
                <CheckBoxOutlineBlankIcon className={classes.wrapperIcon} />
              }
              checkedIcon={
                <CheckBoxOutlinedIcon className={classes.checkedIcon} />
              }
              disableRipple
            />
          )}
          label="Sensor"
        />
        <FormControlLabel
          classes={{ label: classes.label, root: classes.labelRoot }}
          control={(
            <Checkbox
              color="default"
              className={classes.itemWrapper}
              icon={
                <CheckBoxOutlineBlankIcon className={classes.wrapperIcon} />
              }
              checkedIcon={
                <CheckBoxOutlinedIcon className={classes.checkedIcon} />
              }
              disableRipple
            />
          )}
          label="Sensor"
        />
      </FormGroup>
    ) : (
      <RadioGroup defaultValue="sensor1" aria-label="sensors">
        <FormControlLabel
          classes={{ label: classes.label, root: classes.labelRoot }}
          label="Sensor"
          control={(
            <Radio
              value="sensor1"
              disableRipple
              color="default"
              className={classes.itemWrapper}
              checkedIcon={
                <RadioButtonCheckedIcon className={classes.checkedIcon} />
              }
              icon={
                <RadioButtonUncheckedIcon className={classes.wrapperIcon} />
              }
            />
          )}
        />
        <FormControlLabel
          classes={{ label: classes.label, root: classes.labelRoot }}
          label="Sensor"
          control={(
            <Radio
              value="sensor2"
              disableRipple
              color="default"
              className={classes.itemWrapper}
              checkedIcon={
                <RadioButtonCheckedIcon className={classes.checkedIcon} />
              }
              icon={
                <RadioButtonUncheckedIcon className={classes.wrapperIcon} />
              }
            />
          )}
        />
        <FormControlLabel
          classes={{ label: classes.label, root: classes.labelRoot }}
          label="Sensor"
          control={(
            <Radio
              value="sensor3"
              disableRipple
              color="default"
              className={classes.itemWrapper}
              checkedIcon={
                <RadioButtonCheckedIcon className={classes.checkedIcon} />
              }
              icon={
                <RadioButtonUncheckedIcon className={classes.wrapperIcon} />
              }
            />
          )}
        />
        <FormControlLabel
          classes={{ label: classes.label, root: classes.labelRoot }}
          label="Sensor"
          control={(
            <Radio
              value="sensor4"
              disableRipple
              color="default"
              className={classes.itemWrapper}
              checkedIcon={
                <RadioButtonCheckedIcon className={classes.checkedIcon} />
              }
              icon={
                <RadioButtonUncheckedIcon className={classes.wrapperIcon} />
              }
            />
          )}
        />
      </RadioGroup>
    )}
  </div>
);

export default withStyles(styles)(ListContent);
