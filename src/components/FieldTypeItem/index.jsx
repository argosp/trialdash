import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';
import CustomInput from '../CustomInput';
import { styles } from './styles';
import {
  FIELD_TYPE_ITEM_INPUT_TYPE,
  FIELD_TYPES_ICONS,
} from '../../constants/fieldTypes';
import ListContent from './ListContent';
import CustomTooltip from '../CustomTooltip';
import { BasketIcon, CloneIcon, CrossIcon, PenIcon } from '../../constants/icons';

class FieldTypeItem extends React.Component {
  state = {
    isMouseHover: false,
  };

  handleWrapperMouseEnter = () => {
    this.setState({ isMouseHover: true });
  };

  handleWrapperMouseLeave = () => {
    this.setState({ isMouseHover: false });
  };

  render() {
    const {
      classes,
      contentType,
      fieldType,
      placeholder,
      cloneFieldType,
      deleteFieldType,
      isEditModeEnabled,
      activateEditMode,
      editedFieldTypeKey,
      onValueChange,
    } = this.props;
    const { isMouseHover } = this.state;

    return (
      <Grid
        container
        className={
          isEditModeEnabled && editedFieldTypeKey === fieldType.key
            ? classnames(classes.wrapperEditMode, classes.wrapper)
            : classes.wrapper
        }
        onMouseEnter={!isEditModeEnabled ? this.handleWrapperMouseEnter : null}
        onMouseLeave={!isEditModeEnabled ? this.handleWrapperMouseLeave : null}
      >
        <Grid item container xs={6} alignItems="center" wrap="nowrap">
          <CrossIcon className={
            isMouseHover && !isEditModeEnabled
              ? classes.crossIcon
              : classes.hiddenCrossIcon
          }
          />
          {contentType === FIELD_TYPE_ITEM_INPUT_TYPE ? (
            <CustomInput
              className={classes.input}
              id={fieldType.key}
              placeholder={placeholder}
              withBorder
              value={fieldType.value}
              onChange={e => onValueChange(e, 'input', fieldType.key, 'value')}
              bottomDescription={fieldType.description}
              label={(
                <Grid container alignItems="center">
                  {FIELD_TYPES_ICONS[fieldType.type]}
                  {fieldType.label}
                </Grid>
              )}
            />
          ) : (
            <ListContent
              contentType={contentType}
              fieldType={fieldType}
            />
          )}
        </Grid>
        <Grid item container xs={6} justify="flex-end" alignItems="center">
          <CustomTooltip
            title="Edit"
            className={
              (!isMouseHover || isEditModeEnabled) && classes.hiddenAttributeButton
            }
            ariaLabel="edit"
            onClick={() => activateEditMode(fieldType)}
          >
            <PenIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Clone"
            className={
              (!isMouseHover || isEditModeEnabled) && classes.hiddenAttributeButton
            }
            ariaLabel="clone"
            onClick={cloneFieldType}
          >
            <CloneIcon />
          </CustomTooltip>
          <CustomTooltip
            title="Delete"
            className={
              (!isMouseHover || isEditModeEnabled) && classes.hiddenAttributeButton
            }
            ariaLabel="delete"
            onClick={deleteFieldType}
          >
            <BasketIcon />
          </CustomTooltip>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(FieldTypeItem);
