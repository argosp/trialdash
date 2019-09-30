import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import CustomInput from '../CustomInput';
import { styles } from './styles';
import {
  ATTRIBUTE_ITEM_INPUT_TYPE,
  FIELD_TYPES,
} from '../../constants/attributes';
import ListContent from './ListContent';

class AttributeItem extends React.Component {
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
      title,
      description,
      inputId,
      placeholder,
    } = this.props;
    const { isMouseHover } = this.state;

    return (
      <Grid container className={classes.root}>
        <Grid
          item
          container
          xs={7}
          className={classes.wrapper}
          onMouseEnter={this.handleWrapperMouseEnter}
          onMouseLeave={this.handleWrapperMouseLeave}
        >
          <Grid item container xs={6} alignItems="center" wrap="nowrap">
            <OpenWithIcon
              className={
                isMouseHover
                  ? classes.crossIcon
                  : classnames(classes.crossIcon, classes.hiddenCrossIcon)
              }
            />
            {contentType === ATTRIBUTE_ITEM_INPUT_TYPE ? (
              <CustomInput
                className={classes.input}
                id={inputId}
                placeholder={placeholder}
                withBorder
                bottomDescription={description}
                label={(
                  <Grid container alignItems="center">
                    {FIELD_TYPES[fieldType].iconComponent}
                    {title}
                  </Grid>
)}
              />
            ) : (
              <ListContent
                contentType={contentType}
                fieldType={fieldType}
                title={title}
                description={description}
              />
            )}
          </Grid>
          <Grid item container xs={6} justify="flex-end" alignItems="center">
            <Tooltip
              title="Edit attribute"
              className={
                isMouseHover
                  ? classes.attributeButton
                  : classes.hiddenAttributeButton
              }
            >
              <IconButton aria-label="edit attribute">
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Clone attribute"
              className={
                isMouseHover
                  ? classes.attributeButton
                  : classes.hiddenAttributeButton
              }
            >
              <IconButton aria-label="clone attribute">
                <QueueOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Delete attribute"
              className={
                isMouseHover
                  ? classes.attributeButton
                  : classes.hiddenAttributeButton
              }
            >
              <IconButton aria-label="delete attribute">
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(AttributeItem);
