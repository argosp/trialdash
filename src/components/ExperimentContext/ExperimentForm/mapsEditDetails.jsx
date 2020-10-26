import React, { useState, useEffect, useRef } from "react";
import { Map as LeafletMap, Tooltip } from "react-leaflet";
import {
  TileLayer,
  LayersControl,
  ImageOverlay,
  MapControl,
  withLeaflet,
  Popup,
  CircleMarker,
  Polyline
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
import { canvas, latLng } from "leaflet";

const defaultPosition = [32.0852, 34.782];

// function DelayedTextField(props) {
//   const { value, onChange } = props;

//   useEffect(() => {
//     const timeOutId = setTimeout(() => setDisplayMessage(query), 500);
//     return () => clearTimeout(timeOutId);
//   }, [query]);


//   return (
//       <TextField
//         value={value}
//         onChange={event => setQuery(event.target.value)}
//         {...props}
//       />
//   );
// }

const ControlPointText = ({ point, setPoint }) => (
  <Grid container direction="column" justify="space-evenly" alignItems="center" spacing={1}>
    <Grid item>
      <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={1}>
        <Grid item>
          <TextField
            value={point.lat}
            onChange={(e) => setPoint({ ...point, lat: parseFloat(e.target.value) })}
            style={{ width: '120px' }}
            variant="outlined"
            label="Lat"
          />
        </Grid >
        <Grid item>
          <TextField
            value={point.lng}
            onChange={(e) => setPoint({ ...point, lng: parseFloat(e.target.value) })}
            style={{ width: '120px' }}
            variant="outlined"
            label="Long"
          />
        </Grid >
      </Grid>
    </Grid>
    <Grid item>
      <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={1}>
        <Grid item>
          <TextField
            value={point.x}
            onChange={(e) => setPoint({ ...point, x: parseFloat(e.target.value) })}
            style={{ width: '120px' }}
            variant="outlined"
            label="X img"
          />
        </Grid >
        <Grid item>
          <TextField
            value={point.y}
            onChange={(e) => setPoint({ ...point, y: parseFloat(e.target.value) })}
            style={{ width: '120px' }}
            variant="outlined"
            label="Y img"
          />
        </Grid >
      </Grid>
    </Grid>
  </Grid>
)

export const MapsEditDetails = ({ row, setRow }) => {
  const mapAttrib = process.env.REACT_APP_MAP_ATTRIBUTION || '&copy; <a href="https://carto.com">Carto</a> contributors';
  const mapTileUrl = process.env.REACT_APP_MAP_URL || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';

  const mapRef = React.useRef(null);

  const hasNans = [row.lower, row.upper, row.left, row.right].findIndex(x => !Number.isFinite(x)) !== -1;

  const middlePosition = [(row.lower + row.upper) / 2, (row.left + row.right) / 2];
  const [position, setPosition] = useState(hasNans ? defaultPosition : middlePosition);
  const [dragOnMap, setDragOnMap] = useState(true);
  const imageSize = { x: row.width || 300, y: row.height || 400 };
  const [controlPoints, setControlPoints] = useState([
    { lat: row.upper, lng: row.left, x: 0, y: 0 },
    { lat: row.lower, lng: row.right, x: imageSize.x, y: imageSize.y },
  ]);
  const [selectedControlPoint, setSelectedControlPoint] = useState(0);

  const calcBoxFromPoints = (lat0, lng0, lat1, lng1, x0, y0, x1, y1, xsize, ysize) => {
    const right = lng0 + (lng1 - lng0) / (x1 - x0) * (xsize - x0);
    const left = lng1 - (lng1 - lng0) / (x1 - x0) * x1;
    const lower = lat0 + (lat1 - lat0) / (y1 - y0) * (ysize - y0);
    const upper = lat1 - (lat1 - lat0) / (y1 - y0) * y1;
    return { lower, right, upper, left };
  }

  const changeControlPoint = (point, index) => {
    const newpoints = controlPoints.slice();
    newpoints[index] = point;
    setControlPoints(newpoints);
    const box = calcBoxFromPoints(
      newpoints[0].lat, newpoints[0].lng,
      newpoints[1].lat, newpoints[1].lng,
      newpoints[0].x, newpoints[0].y,
      newpoints[1].x, newpoints[1].y,
      imageSize.x, imageSize.y
    )
    setRow(Object.assign({}, row, box))
  }

  const distancePixels = (cp1, cp2) => {
    const dx = cp1.x - cp2.x;
    const dy = cp1.y - cp2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  const distanceMeters = (cp1, cp2) => {
    return latLng(cp1).distanceTo(latLng(cp2));
  }

  const changeDistanceMeters = (pointIndexToChange, val) => {
    const p = controlPoints[selectedControlPoint];
    const q = controlPoints[pointIndexToChange];
    const dist = distanceMeters(p, q);
    if (!Number.isFinite(val) || val < 0.001) return;
    const factor = val / dist;
    const qlat = p.lat + (q.lat - p.lat) * factor;
    const qlng = p.lng + (q.lng - p.lng) * factor;
    changeControlPoint({ ...q, lat: qlat, lng: qlng }, pointIndexToChange)
  }

  const changeDistancePixels = (pointIndexToChange, val) => {
    const p = controlPoints[selectedControlPoint];
    const q = controlPoints[pointIndexToChange];
    const dist = distancePixels(p, q);
    if (!Number.isFinite(val) || val < 0.001) return;
    const factor = val / dist;
    const qlat = p.lat + (q.lat - p.lat) * factor;
    const qlng = p.lng + (q.lng - p.lng) * factor;
    const qx = p.x + (q.x - p.x) * factor;
    const qy = p.y + (q.y - p.y) * factor;
    changeControlPoint({ ...q, lat: qlat, lng: qlng, x: qx, y: qy }, pointIndexToChange);
  }

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
            <ControlPointText
              point={controlPoints[selectedControlPoint]}
              setPoint={(point) => changeControlPoint(point, selectedControlPoint)}
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
            key='map'
            attribution={mapAttrib}
            url={mapTileUrl}
          />
          {hasNans ? null :
            <ImageOverlay
              key='image'
              url={row.imageUrl}
              bounds={[[row.upper, row.left], [row.lower, row.right]]}
            />
          }
          {controlPoints.map((point, pointIndex) =>
            <MarkedPoint
              key={pointIndex}
              location={[point.lat, point.lng]}
              // dragLocation={console.log}
              setLocation={p => {
                if (dragOnMap) {
                  changeControlPoint({ ...controlPoints[pointIndex], lat: p[0], lng: p[1] }, pointIndex);
                } else {
                  const y = (p[0] - row.upper) / (row.lower - row.upper) * imageSize.y;
                  const x = (p[1] - row.left) / (row.right - row.left) * imageSize.x;
                  changeControlPoint({ lat: p[0], lng: p[1], x: x, y: y }, pointIndex);
                }
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
          <Polyline
            positions={controlPoints.map(p => [p.lat, p.lng])}
            color={'black'}
            weight={2}
            dashArray={'4 4'}
            renderer={canvas({ padding: 0.2, tolerance: 10 })}
          >
            <Popup permanent>
              <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={1}>
                <Grid item>
                  <TextField
                    value={Math.round(distanceMeters(controlPoints[0], controlPoints[1]) * 100) / 100}
                    onChange={(e) => changeDistanceMeters(1 - selectedControlPoint, parseFloat(e.target.value))}
                    style={{ width: '120px' }}
                    variant="outlined"
                    label="meters"
                    size="small"
                  />
                </Grid >
                <Grid item>
                  <TextField
                    value={Math.round(distancePixels(controlPoints[0], controlPoints[1]) * 100) / 100}
                    onChange={(e) => changeDistancePixels(1 - selectedControlPoint, parseFloat(e.target.value))}
                    style={{ width: '120px' }}
                    variant="outlined"
                    label="pixels"
                    size="small"
                  />
                </Grid >
              </Grid>
            </Popup>
          </Polyline>
        </LeafletMap>
      </Grid>
    </Grid>
  )
}
