import React, { useState, useEffect, useRef } from "react";
import { Map as LeafletMap, Tooltip } from "react-leaflet";
import {
  TileLayer,
  LayersControl,
  ImageOverlay,
  MapControl,
  withLeaflet,
  Popup,
  CircleMarker
} from "react-leaflet";
import {
  IconButton,
  Icon,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  TextField
} from '@material-ui/core';
import { MarkedPoint } from "../../DevicePlanner/MarkedPoint";

const defaultPosition = [32.0852, 34.782];

export const MapsEditDetails = ({ row, setRow }) => {
  const mapAttrib = process.env.REACT_APP_MAP_ATTRIBUTION || '&copy; <a href="https://carto.com">Carto</a> contributors';
  const mapTileUrl = process.env.REACT_APP_MAP_URL || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';

  const mapRef = React.useRef(null);

  const hasNans = [row.lower, row.upper, row.left, row.right].findIndex(x => !Number.isFinite(x)) !== -1;

  const middlePosition = [(row.lower + row.upper) / 2, (row.left + row.right) / 2];
  const [position, setPosition] = useState(hasNans ? defaultPosition : middlePosition);
  const [dragOnMap, setDragOnMap] = useState(true);
  const [controlPoints, setControlPoints] = useState([[row.lower, row.left], [row.upper, row.right]]);
  const [selectedControlPoint, setSelectedControlPoint] = useState(0);
  return (
    <Grid container>
      <Grid item xs={2}>
        <Grid container direction="column"
          justify="flex-start"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  checked={dragOnMap}
                  onChange={(e) => setDragOnMap(e.target.checked)}
                  color="primary"
                />
              }
              label={dragOnMap ? 'Drag on Map' : 'Drag on Image'}
              labelPlacement='top'
            />
          </Grid>
          <Grid item>
            <Grid container justify="space-evenly" alignItems="center" spacing={1}>
              <Grid item>
                <TextField
                  value={controlPoints[selectedControlPoint][0]}
                  // onChange={(e) => setLat(parseFloat(e.target.value))}
                  style={{ width: '120px' }}
                  variant="outlined"
                  label="Lat"
                />
              </Grid >
              <Grid item>
                <TextField
                  value={controlPoints[selectedControlPoint][1]}
                  // onChange={(e) => setLng(parseFloat(e.target.value))}
                  style={{ width: '120px' }}
                  variant="outlined"
                  label="Long"
                />
              </Grid >
            </Grid>
          </Grid>
          <Grid item>
            <Grid container justify="space-evenly" alignItems="center" spacing={1}>
              <Grid item>
                <TextField
                  value={100}
                  // onChange={(e) => setLat(parseFloat(e.target.value))}
                  style={{ width: '120px' }}
                  variant="outlined"
                  label="X img"
                />
              </Grid >
              <Grid item>
                <TextField
                  value={200}
                  // onChange={(e) => setLng(parseFloat(e.target.value))}
                  style={{ width: '120px' }}
                  variant="outlined"
                  label="Y img"
                />
              </Grid >
            </Grid>
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
            key='map'
            attribution={mapAttrib}
            url={mapTileUrl}
          />
          {hasNans ? null :
            <ImageOverlay
              key='image'
              url={row.imageUrl}
              bounds={[[row.lower, row.right], [row.upper, row.left]]}
            />
          }
          {controlPoints.map((point, pointIndex) =>
            <MarkedPoint
              key={point}
              location={point}
              // dragLocation={console.log}
              setLocation={newpoint => {
                const newpoints = controlPoints.slice();
                newpoints[pointIndex] = newpoint;
                setControlPoints(newpoints);
                setSelectedControlPoint(pointIndex);
              }}
              onClick={() => setSelectedControlPoint(pointIndex)}
            >
            </MarkedPoint>
          )}
          <CircleMarker
            key='chosen'
            center={controlPoints[selectedControlPoint]}
            radius={9}
            color={'red'}
            opacity={1}
            dashArray={'4 4'}
            weight={2}
          />
        </LeafletMap>
      </Grid>
    </Grid>
  )
}
