import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { styles } from './styles';

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
}) => (
  <TextField
    disabled={disabled}
    value={value}
    onChange={onChange}
    className={className}
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
);

export default withStyles(styles)(CustomInput);
