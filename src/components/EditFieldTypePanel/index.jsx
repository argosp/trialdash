import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';
import { styles } from './styles';
import RightPanelContainer from '../RightPanelContainer';
import CustomInput from '../CustomInput';
import SwitchSection from './SwitchSection';
import SimpleButton from '../SimpleButton';
import { FIELD_TYPES_ICONS } from '../../constants/fieldTypes';

const EditFieldTypePanel = ({
  classes,
  deactivateEditMode,
  fieldType,
  onValueChange,
  cancelChanges,
  isPanelOpen,
}) => (
  <RightPanelContainer
    isPanelOpen={isPanelOpen}
    onClose={() => cancelChanges(fieldType.key)}
    title={(
      <div className={classes.header}>
        {FIELD_TYPES_ICONS[fieldType.type]}
        <span className={classes.headerTitle}>{fieldType.label}</span>
      </div>
    )}
  >
    <div className={classes.content}>
      <CustomInput
        value={fieldType.label || ''}
        onChange={e => onValueChange(e, 'input', fieldType.key, 'label')}
        id="field-type-label"
        label="Label"
        placeholder="Label"
        bottomDescription="a short description about the device name"
        className={classes.input}
      />
      <CustomInput
        value={fieldType.description || ''}
        onChange={e => onValueChange(e, 'input', fieldType.key, 'description')}
        id="field-type-description"
        label="Description"
        placeholder="Description"
        bottomDescription="a short description about the device name"
        className={classes.input}
      />
      <CustomInput
        value={fieldType.id || ''}
        onChange={e => onValueChange(e, 'input', fieldType.key, 'id')}
        id="field-type-id"
        label="ID"
        bottomDescription="a short description about the device name"
        className={classes.input}
      />
      <CustomInput
        value={fieldType.value || ''}
        onChange={e => onValueChange(e, 'input', fieldType.key, 'value')}
        id="field-type-value"
        label="Value"
        bottomDescription="a short description about the device name"
        className={classes.input}
      />
      <Grid container spacing={3}>
        <Grid item xs>
          <CustomInput
            value={fieldType.prefix || ''}
            onChange={e => onValueChange(e, 'input', fieldType.key, 'prefix')}
            id="field-type-prefix"
            label="Prefix"
            bottomDescription="a short description about the device name"
            className={classes.input}
          />
        </Grid>
        <Grid item xs>
          <CustomInput
            value={fieldType.suffix || ''}
            onChange={e => onValueChange(e, 'input', fieldType.key, 'suffix')}
            id="field-type-suffix"
            label="Suffix"
            bottomDescription="a short description about the device name"
            className={classes.input}
          />
        </Grid>
      </Grid>
      <SwitchSection
        onChange={e => onValueChange(e, 'switch', fieldType.key, 'required')}
        className={classes.requiredSwitch}
        title="Required"
        description="a short description about the device name"
        isChecked={fieldType.required}
      />
      <CustomInput
        value={fieldType.template || ''}
        onChange={e => onValueChange(e, 'input', fieldType.key, 'template')}
        id="field-type-template"
        className={classnames(classes.input, classes.templateInput)}
        bottomDescription={(
          <>
            set template using inside {'{}'}
            <br />
            [N] - number counter
            <br />
            [A] - letter counter
            <br />
            {'{device[N]}'} : device1, device2, device3...
          </>
        )}
      />
      <SwitchSection
        onChange={e => onValueChange(e, 'switch', fieldType.key, 'multipleValues')}
        title="Multiple values"
        description="a short description about the device name"
        isChecked={fieldType.multipleValues}
      />
      <SwitchSection
        onChange={e => onValueChange(e, 'switch', fieldType.key, 'trialField')}
        title="Trial field"
        description="this field is set per trial"
        isChecked={fieldType.trialField}
      />
      <Grid
        container
        wrap="nowrap"
        spacing={2}
        className={classes.buttonsWrapper}
      >
        <Grid item xs>
          <SimpleButton
            className={classes.button}
            colorVariant="primary"
            onClick={deactivateEditMode}
            text="Save"
          />
        </Grid>
        <Grid item xs>
          <SimpleButton
            variant="outlined"
            className={classnames(classes.button, classes.cancelButton)}
            onClick={() => cancelChanges(fieldType.key)}
            text="Cancel"
          />
        </Grid>
      </Grid>
    </div>
  </RightPanelContainer>
);

export default withStyles(styles)(EditFieldTypePanel);
