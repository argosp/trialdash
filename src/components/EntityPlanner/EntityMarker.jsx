import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { ReactComponent as CellTowerIcon } from './CellTowerIcon.svg';
import processingDecimalDigits from './utils/processingDecimalDigits';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { styles } from './styles';

const useStyles = makeStyles(styles);

export const EntityMarker = ({
  entity,
  devLocation,
  isSelected,
  isTypeSelected,
  isOnEdit,
  shouldShowName,
  handleMarkerClick,
  onContextMenu,
}) => {
  const classes = useStyles();

  return (
    <Marker
      key={entity.name}
      position={devLocation}
      // onclick={() => handleMarkerClick(entity)}
      oncontextmenu={onContextMenu}
      title={entity.name}
      icon={divIcon({
        iconSize: [20, 20],
        iconAnchor: [10, 22],
        html: renderToStaticMarkup(
          <Typography component={'div'}>
            <i
              className="fas fa-circle fa-lg"
              style={{ color: isOnEdit ? '#2D9CDB' : '#27AE60' }}
              // save this comment to future develop with groups
              // style={{ color: (isTypeSelected ? (isSelected ? '#9B51E0' : '#2D9CDB') : '#27AE60') }}
            />
            {!shouldShowName ? null : (
              <Typography component={'span'} className={classes.entityName}>
                {entity.name.replace(/ /g, '\u00a0')}
              </Typography>
            )}
          </Typography>
        ),
      })}>
      <Popup position={[devLocation[0] + 0.0008, devLocation[1]]}>
        <Grid container className={classes.popup}>
          <Grid item className={classes.towerIcon}>
            <CellTowerIcon />
          </Grid>
          <Grid item>
            <Grid className={classes.entityNamePopup}>{entity.name}</Grid>
            <Grid item className={classes.entityLocation}>
              {`${processingDecimalDigits(devLocation[0])}
             X
              ${processingDecimalDigits(devLocation[1])}
           `}
            </Grid>
          </Grid>
        </Grid>
      </Popup>
    </Marker>
  );
};
