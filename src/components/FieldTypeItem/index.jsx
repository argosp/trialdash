import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import SvgIcon from '@material-ui/core/SvgIcon';
import CustomInput from '../CustomInput';
import { styles } from './styles';
import {
  FIELD_TYPE_ITEM_INPUT_TYPE,
  FIELD_TYPES_ICONS,
} from '../../constants/fieldTypes';
import ListContent from './ListContent';
import CustomTooltip from '../CustomTooltip';
import { ReactComponent as CloneIcon } from '../../assets/icons/clone.svg';
import { ReactComponent as BasketIcon } from '../../assets/icons/basket.svg';
import { ReactComponent as PenIcon } from '../../assets/icons/pen.svg';
import { ReactComponent as CrossIcon } from '../../assets/icons/cross.svg';

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
          <SvgIcon
            component={CrossIcon}
            className={
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
              isMouseHover && !isEditModeEnabled
                ? classes.attributeButton
                : classes.hiddenAttributeButton
            }
          >
            <IconButton
              aria-label="edit"
              onClick={() => activateEditMode(fieldType)}
            >
              <SvgIcon component={PenIcon} />
            </IconButton>
          </CustomTooltip>
          <CustomTooltip
            title="Clone"
            className={
              isMouseHover && !isEditModeEnabled
                ? classes.attributeButton
                : classes.hiddenAttributeButton
            }
          >
            <IconButton aria-label="clone" onClick={cloneFieldType}>
              <SvgIcon component={CloneIcon} />
            </IconButton>
          </CustomTooltip>
          <CustomTooltip
            title="Delete"
            className={
              isMouseHover && !isEditModeEnabled
                ? classes.attributeButton
                : classes.hiddenAttributeButton
            }
          >
            <IconButton aria-label="delete" onClick={deleteFieldType}>
              <SvgIcon component={BasketIcon} />
            </IconButton>
          </CustomTooltip>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(FieldTypeItem);
