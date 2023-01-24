import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import { Divider, IconButton, Typography } from '@material-ui/core';
import { icons } from './utils';

import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import { PopperBox } from './PopperBox.jsx';
import { useShape } from '../ShapeContext.jsx';

const useStyles = makeStyles(styles);

export const EditTable = ({
  TBPEntities,
  removeEntityFromTBPTable,
  onSingleShapeSubmit,
  handlePutEntitiesOnPrev,
  markedPoints,
}) => {
  const [editTableMode, setEditTableMode] = useState('Free');
  const classes = useStyles();
  const { shape, setShape, rectRows, setRectRows, shapeOptions } = useShape();

  const handleClick = (value) => {
    if (value !== '') {
      const state = value !== editTableMode ? value : 'Point';
      setEditTableMode(state);
      setShape(state.charAt(0).toUpperCase() + state.slice(1));
    }
  };

  const onSubmit = (positions) => {
    if (editTableMode === 'Point' || editTableMode === 'Free') {
      onSingleShapeSubmit({ latlng: { lat: positions.x, lng: positions.y } });
    } else {
      handlePutEntitiesOnPrev();
    }

    setEditTableMode('Point');
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
            {editTableMode === value && value !== 'Point' && (
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
