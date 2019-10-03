import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import Radio from '@material-ui/core/Radio';
import {
  FIELD_TYPE_ITEM_CHECKBOX_TYPE,
  FIELD_TYPES,
} from '../../../constants/attributes';
import { styles } from './styles';

const ListContent = ({
  title,
  fieldType,
  classes,
  description,
  contentType,
}) => (
  <div>
    <Grid container alignItems="center">
      {FIELD_TYPES[fieldType].iconComponent}
      <span className={classes.title}>{title}</span>
    </Grid>
    <p className={classes.description}>{description}</p>
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
