import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import CustomInput from '../CustomInput';
import { styles } from './styles';
import {
  FIELD_TYPE_ITEM_INPUT_TYPE,
  FIELD_TYPES,
} from '../../constants/attributes';
import ListContent from './ListContent';
import CustomTooltip from '../CustomTooltip';

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
      description,
      placeholder,
      changeFieldTypeValueHandler,
      cloneFieldType,
      deleteFieldType,
      isEditModeEnabled,
      activateEditMode,
      editedFieldTypeId,
    } = this.props;
    const { isMouseHover } = this.state;

    return (
      <Grid
        container
        className={
          isEditModeEnabled && editedFieldTypeId === fieldType.key
            ? classnames(classes.wrapperEditMode, classes.wrapper)
            : classes.wrapper
        }
        onMouseEnter={!isEditModeEnabled ? this.handleWrapperMouseEnter : null}
        onMouseLeave={!isEditModeEnabled ? this.handleWrapperMouseLeave : null}
      >
        <Grid item container xs={6} alignItems="center" wrap="nowrap">
          <OpenWithIcon
            className={
              isMouseHover && !isEditModeEnabled
                ? classes.crossIcon
                : classes.hiddenCrossIcon
            }
          />
          {contentType === FIELD_TYPE_ITEM_INPUT_TYPE ? (
            <CustomInput
              value={fieldType.val || ''}
              className={classes.input}
              id={fieldType.key}
              placeholder={placeholder}
              withBorder
              bottomDescription={description}
              onChange={changeFieldTypeValueHandler}
              label={(
                <Grid container alignItems="center">
                  {FIELD_TYPES[fieldType.type].iconComponent}
                  {fieldType.title}
                </Grid>
)}
            />
          ) : (
            <ListContent
              contentType={contentType}
              fieldType={fieldType.type}
              title={fieldType.title}
              description={description}
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
              onClick={() => activateEditMode(fieldType.key)}
            >
              <EditOutlinedIcon />
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
              <QueueOutlinedIcon />
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
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </CustomTooltip>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(FieldTypeItem);
