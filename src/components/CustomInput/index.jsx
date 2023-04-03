import React from 'react';
import classnames from 'classnames';
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
import CustomLocation from '../CustomLocation';

const CustomSwitch = withStyles(switcher)(Switch);

const handleToggle = (e, value, onChange, multiple) => {
  onChange({ target: { value: (multiple ? value.join(',') : value) } });
};

const renderSwitch = ({ label, bottomDescription, id, classes, withBorder, placeholder, className, onChange, value, inputProps, disabled, type, values, multiple, invalid, errorText, endAdornment, onClick }) => {
  let _value;
  if (!errorText) errorText = 'Please select a value';
  switch (type) {
    case 'location':
      return (
        <Grid className={className}>
          <Typography variant="h6" classes={{ root: classes.label }}>
            {label}
          </Typography>
          <CustomLocation
            id={id}
            value={value}
            classes={classes}
            placeholder={placeholder}
            onChange={onChange}
            withBorder={withBorder}
            label={label}
          />
          {bottomDescription && <FormHelperText>{bottomDescription}</FormHelperText>}
          {invalid && <FormHelperText classes={{ root: classes.error }}>{errorText}</FormHelperText>}
        </Grid>
      );
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
          {bottomDescription && <FormHelperText>{bottomDescription}</FormHelperText>}
          {invalid && <FormHelperText classes={{ root: classes.error }}>{errorText}</FormHelperText>}
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
          {bottomDescription && <FormHelperText>{bottomDescription}</FormHelperText>}
          {invalid && <FormHelperText classes={{ root: classes.error }}>{errorText}</FormHelperText>}
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
            minRows={3}
            onChange={onChange}
            value={(value !== null && value !== undefined) ? value : ''}
            className={classes.textArea}
          />
          {bottomDescription && <FormHelperText>{bottomDescription}</FormHelperText>}
          {invalid && <FormHelperText classes={{ root: classes.error }}>{errorText}</FormHelperText>}
        </Grid>
      );
    default:
      return (
        <Grid>
          <TextField
            className={className}
            type={type}
            disabled={disabled}
            value={(value !== null && value !== undefined) ? value : ''}
            onChange={onChange}
            label={label}
            helperText={bottomDescription}
            id={id}
            onClick={onClick}
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
              endAdornment: endAdornment,
            }}
          />
          {invalid && <FormHelperText classes={{ root: classnames(classes.error, classes.textFieldError) }}>{errorText}</FormHelperText>}
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
  errorText,
  endAdornment,
  onClick
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
      errorText,
      endAdornment,
      onClick
    })}
  </div>
);

export default withStyles(styles)(CustomInput);
