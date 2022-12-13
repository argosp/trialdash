import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import { Divider, Grid, IconButton, Typography } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { icons } from './utils';

import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { styles } from './styles';

const useStyles = makeStyles(styles);

const PopperBox = ({ title, value, handleClick, classes, children }) => {
  return (
    <Box sx={{ position: 'absolute', top: 0, left: '100%' }}>
      <Grid container className={classes.toolBoxContainer}>
        <Grid item className={classes.toolBoxItem}>
          <IconButton onClick={() => handleClick(value)}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography component="span">
            <Box sx={{ fontWeight: '700' }}>{title}</Box>
          </Typography>
        </Grid>
        <Grid item>{children}</Grid>
      </Grid>
    </Box>
  );
};

function EditTable({
  TBPEntities,
  removeEntityFromTBPTable,
  onShapeChange,
  onSingleShapeSubmit,
  handlePutEntitiesOnPrev,
  markedPoints,
}) {
  const [editTableMode, setEditTableMode] = useState('free');
  const classes = useStyles();

  const handleClick = (value) => {
    if (value !== '') {
      const state = value !== editTableMode ? value : 'point';
      setEditTableMode(state);
      onShapeChange(state.charAt(0).toUpperCase() + state.slice(1));
    }
  };

  const onSubmit = (positions) => {
    if (editTableMode === 'point' || editTableMode === 'free') {
      onSingleShapeSubmit({ latlng: { lat: positions.x, lng: positions.y } });
    } else {
      handlePutEntitiesOnPrev();
    }

    setEditTableMode('point');
  };

  return (
    <Box className={classnames(classes.root, classes.editTable)}>
      <Typography variant="overline" align="center">
        tools
      </Typography>

      {icons.map(({ icon, value, component, title }, index) => {
        const iconStyle = editTableMode === value ? classes.activeButton : null;
        const iconButtonStyle =
          editTableMode !== '' && editTableMode !== value ? classes.notActiveButton : null;
        return (
          <div
            style={{ position: 'relative', textAlign: 'center' }}
            key={index}
            className={iconStyle}>
            <IconButton key={value} onClick={() => handleClick(value)} className={iconButtonStyle}>
              {icon}
            </IconButton>
            {editTableMode === value && value !== 'point' && (
              <PopperBox title={title} value={value} handleClick={handleClick} classes={classes}>
                {React.cloneElement(component, {
                  classes,
                  onSubmit,
                  TBPEntities,
                  removeEntityFromTBPTable,
                  markedPoints,
                })}
              </PopperBox>
            )}
            {value === 'square' && <Divider variant="middle" light />}
          </div>
        );
      })}
    </Box>
  );
}

export default EditTable;
