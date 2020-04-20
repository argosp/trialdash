import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { styles } from './styles';
import { switcher } from '../EditFieldTypePanel/SwitchSection/styles';

const CustomSwitch = withStyles(switcher)(Switch);

const handleToggle = (e, value, onChange, multiple) => {
  onChange({ target: { value: (multiple ? value.join(',') : value) } });
};

const renderSwitch = ({ label, bottomDescription, id, classes, withBorder, placeholder, className, onChange, value, inputProps, disabled, type, values, multiple, invalid }) => {
  let _value;
  switch (type) {
    case 'selectList':
      if (multiple) {
        _value = value ? value.split(',') : [];
      } else {
        _value = value || '';
      }
      return (
        <Grid className={className}>
          <Typography variant="h6" classes={{ root: classes.label }}>
            {label}
          </Typography>
          <Autocomplete
            multiple={multiple}
            id={id}
            options={values ? values.split(',') : []}
            getOptionLabel={option => option}
            style={{ width: 300 }}
            renderInput={params => <TextField {...params} variant="outlined" />}
            onChange={((e, v) => handleToggle(e, v, onChange, multiple))}
            value={_value}
          />
          <FormHelperText>{bottomDescription}</FormHelperText>
          {invalid && <FormHelperText classes={{ root: classes.error }}>Please select a value</FormHelperText>}
        </Grid>
      );
    case 'boolean':
      return (
        <Grid className={className}>
          <Typography variant="h6" classes={{ root: classes.label }}>
            {label}
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={(
                <CustomSwitch
                  checked={value && value !== 'false'}
                  onChange={(e, switchName) => onChange(e, switchName)}
                  inputProps={{ 'aria-label': 'switch' }}
                  classes={{ root: classes.switcher }}
                />
              )}
            />
          </FormGroup>
          <FormHelperText>{bottomDescription}</FormHelperText>
          {invalid && <FormHelperText classes={{ root: classes.error }}>Please select a value</FormHelperText>}
        </Grid>
      );
    case 'textArea':
      return (
        <Grid>
          <Typography variant="h6" classes={{ root: classes.label }}>
            {label}
          </Typography>
          <TextareaAutosize
            aria-label="minimum height"
            rowsMin={3}
            onChange={onChange}
            value={value}
            className={classes.textArea}
          />
          <FormHelperText>{bottomDescription}</FormHelperText>
          {invalid && <FormHelperText classes={{ root: classes.error }}>Please select a value</FormHelperText>}
        </Grid>
      );
    default:
      return (
        <Grid className={className}>
          <TextField
            type={type}
            disabled={disabled}
            value={value}
            onChange={onChange}
            label={label}
            helperText={bottomDescription}
            id={id}
            fullWidth
            FormHelperTextProps={{ classes: { root: classes.bottomDescription } }}
            placeholder={placeholder}
            InputLabelProps={{
              shrink: true,
              focused: false,
              classes: { formControl: classes.label },
            }}
            InputProps={{
              ...inputProps,
              disableUnderline: true,
              classes: {
                root: withBorder ? classes.inputWithBorder : classes.input,
                formControl: classes.formControl,
                focused: classes.inputFocused,
              },
            }}
          />
          {invalid && <FormHelperText classes={{ root: classes.error }}>Please select a value</FormHelperText>}
        </Grid>
      );
  }
};

const CustomInput = ({
  label,
  bottomDescription,
  id,
  classes,
  withBorder,
  placeholder,
  className,
  onChange,
  value,
  inputProps,
  disabled,
  type,
  values,
  multiple,
  invalid,
}) => (
  <div>
    {renderSwitch({
      label,
      bottomDescription,
      id,
      classes,
      withBorder,
      placeholder,
      className,
      onChange,
      value,
      inputProps,
      disabled,
      type,
      values,
      multiple,
      invalid,
    })}
  </div>
);

export default withStyles(styles)(CustomInput);
