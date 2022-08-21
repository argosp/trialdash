import React from 'react';
import { Box, IconButton, Typography } from '@material-ui/core';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import { makeStyles } from '@material-ui/core';
import { styles } from './styles';
import { getEntityLocationProp } from '../../EntityUtils';

const useStyles = makeStyles(styles);

const StyledIcon = ({ icon }) => <IconButton disabled color="#BDBDBD" children={icon} />;

const TBPEntity = ({ entity, entityType, isSelected, onClick }) => {
  const prop = getEntityLocationProp(entity, entityType);
  const entityLocation = prop && prop.val ? prop.val.coordinates : undefined;
  const classes = useStyles();
  return (
    <div
      className={classes.tbpEntity}
      style={{
        backgroundColor: isSelected ? '#DDF5FC' : 'inherit',
      }}
      onClick={onClick}>
      <StyledIcon icon={<DragIndicatorIcon fontSize="large" />} />

      <div className="titles">
        <Typography
          variant="subtitle1"
          align="left"
          color="textPrimary"
          children={<Box fontWeight={700}>{entity.name}</Box>}
        />
        <Typography
          variant="subtitle2"
          align="left"
          color="textSecondary"
          children={entityType.name}
        />
      </div>
      {entityLocation && (
        <IconButton
          style={{
            width: '30px',
          }}
          className={classes.iconButton}>
          <LocationOnIcon />
        </IconButton>
      )}
      {!entityLocation && (
        <div
          style={{
            width: '30px',
          }}></div>
      )}
      {/* <StyledIcon icon={<LocationOnIcon />} /> */}
    </div>
  );
};

export default TBPEntity;
