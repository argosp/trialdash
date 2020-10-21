import React, { useState, useEffect, useRef } from "react";
import { Map as LeafletMap } from "react-leaflet";
import { TileLayer, LayersControl, ImageOverlay, MapControl, withLeaflet } from "react-leaflet";
import {
  IconButton,
  Icon,
  Button,
  Grid,
  FormControlLabel,
  Switch
} from '@material-ui/core';

const defaultPosition = [32.0852, 34.782];

export const MapsEditDetails = ({ row, setRow }) => {
  const mapAttrib = process.env.REACT_APP_MAP_ATTRIBUTION || '&copy; <a href="https://carto.com">Carto</a> contributors';
  const mapTileUrl = process.env.REACT_APP_MAP_URL || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';

  const mapRef = React.useRef(null);

  const hasNans = [row.lower, row.upper, row.left, row.right].findIndex(x => !Number.isFinite(x)) !== -1;

  const middlePosition = [(row.lower + row.upper) / 2, (row.left + row.right) / 2];
  const [position, setPosition] = useState(hasNans ? defaultPosition : middlePosition);
  const [moveOnMap, setMoveOnMap] = useState(true);

  return (
    <Grid container>
      <Grid item xs={2}>
        <Grid container direction="column"
          justify="flex-start"
          alignItems="center"
          spacing={4}
        >
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={moveOnMap}
                  onChange={(e) => setMoveOnMap(e.target.checked)}
                  color="primary"
                />
              }
              label={moveOnMap ? 'Move on Map' : 'Move on Image'}
              labelPlacement='top'
            />
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                mapRef.current.leafletElement.flyToBounds([[row.lower, row.left], [row.upper, row.right]]);
              }}
              variant='contained'
              color='primary'
            >
              Center image
        </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={10}>
        <LeafletMap
          center={position}
          zoom={15}
          style={{ height: "400px", width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution={mapAttrib}
            url={mapTileUrl}
          />
          {hasNans ? null :
            <ImageOverlay
              url={row.imageUrl}
              bounds={[[row.lower, row.right], [row.upper, row.left]]}
            />
          }
        </LeafletMap>
      </Grid>
    </Grid>
  )
}
