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

const handleToggle = (e, value, onChange) => {
  onChange({ target: { value: value.join(',') } });
};

const renderSwitch = ({ label, bottomDescription, id, classes, withBorder, placeholder, className, onChange, value, inputProps, disabled, type, values }) => {
  switch (type) {
    case 'selectList':
      return (
        <Grid>
          <Typography variant="h6" classes={{ root: classes.label }}>
            {label}
          </Typography>
          <Autocomplete
            multiple
            id={id}
            options={values ? values.split(',') : []}
            getOptionLabel={option => option}
            style={{ width: 300 }}
            renderInput={params => <TextField {...params} label={label} variant="outlined" />}
            onChange={((e, v) => handleToggle(e, v, onChange))}
            value={value ? value.split(',') : []}
          />
          <FormHelperText>{bottomDescription}</FormHelperText>
        </Grid>
      );
    case 'boolean':
      return (
        <Grid>
          <Typography variant="h6" classes={{ root: classes.label }}>
            {label}
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={(
                <Switch
                  checked={value && value !== 'false'}
                  onChange={onChange}
                  name="checkedB"
                  color="primary"
                />
              )}
            />
          </FormGroup>
          <FormHelperText>{bottomDescription}</FormHelperText>
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
          />
          <FormHelperText>{bottomDescription}</FormHelperText>
        </Grid>
      );
    default:
      return (
        <TextField
          type={type}
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
    })}
  </div>
);

export default withStyles(styles)(CustomInput);
