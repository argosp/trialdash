import React from 'react';
import classnames from 'classnames';
import { withStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Autocomplete from '@mui/material/Autocomplete';
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
              disableunderline: 'true',
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
  <>
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
  </>
);

export default withStyles(styles)(CustomInput);
