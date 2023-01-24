import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
import { Divider, IconButton, Typography } from '@material-ui/core';

import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import { PopperBox } from './PopperBox.jsx';
import { useShape } from '../ShapeContext.jsx';
import { icons } from './utils/icons.js';
import { FREEPOSITIONING_SHAPE, POINT_SHAPE } from './utils/constants.js';

const useStyles = makeStyles(styles);

export const EditTable = ({
  TBPEntities,
  removeEntityFromTBPTable,
  onSingleShapeSubmit,
  handlePutEntitiesOnPrev,
  markedPoints,
}) => {
  const [editTableMode, setEditTableMode] = useState(FREEPOSITIONING_SHAPE);
  const classes = useStyles();
  const { shape, setShape, rectRows, setRectRows, shapeOptions } = useShape();

  const handleClick = (value) => {
    if (value !== '') {
      const state = value !== editTableMode ? value : POINT_SHAPE;
      setEditTableMode(state);
      setShape(state);
    }
  };

  const onSubmit = (positions) => {
    if (editTableMode === POINT_SHAPE || editTableMode === FREEPOSITIONING_SHAPE) {
      onSingleShapeSubmit({ latlng: { lat: positions.x, lng: positions.y } });
    } else {
      handlePutEntitiesOnPrev();
    }

    setEditTableMode(POINT_SHAPE);
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
            {editTableMode === value && value !== POINT_SHAPE && (
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
            {value === POINT_SHAPE && <Divider variant="middle" light />}
          </div>
        );
      })}
    </Box>
  );
}
