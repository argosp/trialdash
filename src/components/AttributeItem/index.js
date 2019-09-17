import React from 'react';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CustomInput from '../CustomInput';
import { styles } from './styles';
import { FIELD_TYPES } from '../../constants/attributes';

const AttributeItem = ({ type, title, classes, inputId, placeholder, bottomDescription }) => (
  <Grid container className={classes.root}>
    <Grid item container xs={7} className={classes.wrapper}>
      <Grid item container xs={6} alignItems="center" wrap="nowrap">
        <OpenWithIcon />
        <CustomInput
          className={classes.input}
          id={inputId}
          placeholder={placeholder}
          withBorder
          bottomDescription={bottomDescription}
          label={<Grid container alignItems="center">{FIELD_TYPES[type].iconComponent}{title}</Grid>}
        />
      </Grid>
      <Grid item container xs={6} justify="flex-end" alignItems="center">
        <Tooltip title="Edit attribute" className={classes.attributeButton}>
          <IconButton
            aria-label="edit attribute"
          >
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Clone attribute" className={classes.attributeButton}>
          <IconButton aria-label="clone attribute">
            <QueueOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete attribute" className={classes.attributeButton}>
          <IconButton aria-label="delete attribute">
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  </Grid>
);

export default withStyles(styles)(AttributeItem);
