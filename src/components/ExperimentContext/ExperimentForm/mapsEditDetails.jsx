import React, { useState } from "react";
import {
  Popup,
} from "react-leaflet";
import {
  Button,
  Grid,
  FormControlLabel,
  Switch,
  TextField,
  Typography
} from '@material-ui/core';
import { MarkedPoint } from "../../DevicePlanner/MarkedPoint";
import { latLng } from "leaflet";
import { MapWithImage } from "./MapWithImage";
import { NumberTextField } from "./NumberTextField";
import { DashedPolyline } from "./DashedPolyline";
import { ChosenMarker } from "./ChosenMarker";

const ControlPointText = ({ point, setPoint }) => (
  <Grid container direction="column" justify="space-evenly" alignItems="center" spacing={1}>
    <Grid item>
      <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={1}>
        <Grid item>
          <NumberTextField
            value={point.lat}
            onChange={(num) => setPoint({ ...point, lat: num })}
            label="Lat"
          />
        </Grid>
        <Grid item>
          <NumberTextField
            value={point.lng}
            onChange={(num) => setPoint({ ...point, lng: num })}
            label="Long"
          />
        </Grid>
      </Grid>
    </Grid>
    <Grid item>
      <Grid container direction="row" justify="space-evenly" alignItems="center" spacing={1}>
        <Grid item>
          <NumberTextField
            value={point.x}
            onChange={(num) => setPoint({ ...point, x: num })}
            label="X img"
          />
        </Grid>
        <Grid item>
          <NumberTextField
            value={point.y}
            onChange={(num) => setPoint({ ...point, y: num })}
            label="Y img"
          />
        </Grid>
      </Grid>
    </Grid>
  </Grid>
)

const calcBoxFromSpecificCoords = (lat0, lng0, lat1, lng1, x0, y0, x1, y1, xsize, ysize) => {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  if (angle < 10 || angle > 80) {
    alert("Control points have similar X or Y coord");
    return false;
  }
  const right = lng0 + (lng1 - lng0) / (x1 - x0) * (xsize - x0);
  const left = lng1 - (lng1 - lng0) / (x1 - x0) * x1;
  const lower = lat0 + (lat1 - lat0) / (y1 - y0) * (ysize - y0);
  const upper = lat1 - (lat1 - lat0) / (y1 - y0) * y1;
  return { lower, right, upper, left };
}

const calcBoxFromPoints = (p0, p1, imageSize) => {
  return calcBoxFromSpecificCoords(
    p0.lat, p0.lng,
    p1.lat, p1.lng,
    p0.x, p0.y,
    p1.x, p1.y,
    imageSize.x, imageSize.y);
}

const distancePixels = (cp1, cp2) => {
  const dx = cp1.x - cp2.x;
  const dy = cp1.y - cp2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

const distanceMeters = (cp1, cp2) => {
  return latLng(cp1).distanceTo(latLng(cp2));
}

const PointsWithLine = ({ controlPoints, onPointMove, selectedControlPoint, setSelectedControlPoint, children }) => (
  <>
    {controlPoints.map((point, pointIndex) =>
      <MarkedPoint
        key={pointIndex}
        location={[point.lat, point.lng]}
        // dragLocation={console.log}
        setLocation={p => {
          setSelectedControlPoint(pointIndex);
          onPointMove(p, pointIndex);
        }}
        onClick={() => setSelectedControlPoint(pointIndex)}
      >
      </MarkedPoint>
    )}
    <ChosenMarker
      key='chosen'
      center={controlPoints[selectedControlPoint]}
    />
    <DashedPolyline
      positions={controlPoints}
    >
      {children}
    </DashedPolyline>
  </>
);

const pointLatLngToMeters = (p) => {
  const fix = (n) => Math.round(n * 1e9) / 1e9;
  return `(${fix(p.lng)}, ${fix(p.lat)}) in meters<br/>(${fix(p.x)}, ${fix(p.y)}) in pixels`;
}

// const calcAuxPoints = (anchor, distMeters, distPixels) => {
//   const horizontalPoint = { lat: anchor.lat, lng: anchor.lng + distMeters.lng, x: anchor.x + distPixels.x, y: anchor.y };
//   const verticalPoint = { lat: anchor.lat + distMeters.lat, lng: anchor.lng, x: anchor.x, y: anchor.y - distPixels.y };
//   return [horizontalPoint, verticalPoint];
// }

const MapStandalone = ({ row, setRow }) => {
  const mapRef = React.useRef(null);

  const imageSize = { x: row.width || 300, y: row.height || 400 };
  // const hasNans = [row.lower, row.upper, row.left, row.right].findIndex(x => !Number.isFinite(x)) !== -1;

  const [anchor, setAnchor] = useState({
    lat: (row.upper + row.lower) / 2,
    lng: (row.left + row.right) / 2,
    x: Math.floor(imageSize.x / 2),
    y: Math.floor(imageSize.y / 2)
  });
  const [distPixels, setDistPixels] = useState({
    x: Math.floor(imageSize.x / 2),
    y: Math.floor(imageSize.y / 2)
  });
  const [distMeters, setDistMeters] = useState({
    lat: row.upper - (row.upper + row.lower) / 2,
    lng: (row.left + row.right) / 2 - row.left
  });

  // const changeControlPoint = (point, index) => {
  //   const newpoints = controlPoints.slice();
  //   newpoints[index] = point;
  //   const box = calcBoxFromPoints(newpoints[0], newpoints[1], imageSize);
  //   if (!box) return box;
  //   setControlPoints(newpoints);
  //   setRow(Object.assign({}, row, box));
  //   setTimeout(() => {
  //     fitBounds(box);
  //   }, 200);
  //   return true;
  // }

  React.useEffect(() => {
    mapRef.current.leafletElement.fitBounds([[row.lower, row.left], [row.upper, row.right]]);
  }, []);

  // const [horizontalPoint, verticalPoint] = calcAuxPoints(anchor, distMeters, distPixels);
  const horizontalPoint = { lat: anchor.lat, lng: anchor.lng + distMeters.lng, x: anchor.x + distPixels.x, y: anchor.y };
  const verticalPoint = { lat: anchor.lat + distMeters.lat, lng: anchor.lng, x: anchor.x, y: anchor.y + distPixels.y };

  React.useEffect(() => {
    if (distPixels.x === 0 || distPixels.y === 0 || distMeters.lat === 0 || distMeters.lng === 0) {
      return;
    }

    ///////// p0 = anchor,   p1 = hor/ver point
    //
    // const right = lng0 + (lng1 - lng0) / (x1 - x0) * (xsize - x0);
    // const left = lng1 - (lng1 - lng0) / (x1 - x0) * x1;
    // const lower = lat0 + (lat1 - lat0) / (y1 - y0) * (ysize - y0);
    // const upper = lat1 - (lat1 - lat0) / (y1 - y0) * y1;


    const right = Math.round((anchor.lng + distMeters.lng / distPixels.x * (imageSize.x - anchor.x)) * 1e9) / 1e9;
    const left = Math.round((horizontalPoint.lng - distMeters.lng / distPixels.x * horizontalPoint.x) * 1e9) / 1e9;
    const lower = Math.round((anchor.lat - distMeters.lat / distPixels.y * anchor.y) * 1e9) / 1e9;
    const upper = Math.round((verticalPoint.lat + distMeters.lat / distPixels.y * (imageSize.y - verticalPoint.y)) * 1e9) / 1e9;
    console.log('right', right, row.right);
    console.log('left', left, row.left);
    console.log('lower', lower, row.lower);
    console.log('upper', upper, row.upper);

    // const newpoints = controlPoints.slice();
    // newpoints[index] = point;
    // const box = calcBoxFromPoints(newpoints[0], newpoints[1], imageSize);
    // if (!box) return box;
    // setControlPoints(newpoints);
    // setRow(Object.assign({}, row, box));
    // setTimeout(() => {
    //   fitBounds(box);
    // }, 200);
  });

  return (
    <Grid container>
      <Grid item xs={2}>
        <Grid container direction="column"
          justify="flex-start"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            Image size: ({imageSize.x} x {imageSize.y}) <br />
          </Grid>
          <Grid item>
            <NumberTextField value={anchor.lng} onChange={(num) => setAnchor({ ...anchor, lng: num })} label="Anchor X meters" />
            <NumberTextField value={anchor.lat} onChange={(num) => setAnchor({ ...anchor, lat: num })} label="Anchor Y meters" />
          </Grid>
          <Grid item>
            <NumberTextField value={anchor.x} onChange={(num) => setAnchor({ ...anchor, x: num })} label="Anchor X pixels" />
            <NumberTextField value={anchor.y} onChange={(num) => setAnchor({ ...anchor, y: num })} label="Anchor Y pixels" />
          </Grid>
          <Grid item>
            <NumberTextField value={distMeters.lng} onChange={(num) => setDistMeters({ ...distMeters, lng: num })} label="Horizontal Meters" />
            <NumberTextField value={distPixels.x} onChange={(num) => setDistPixels({ ...distPixels, x: num })} label="Horizontal Pixels" />
          </Grid>
          <Grid item>
            <NumberTextField value={distMeters.lat} onChange={(num) => setDistMeters({ ...distMeters, lat: num })} label="Vertical Meters" />
            <NumberTextField value={distPixels.y} onChange={(num) => setDistPixels({ ...distPixels, y: num })} label="Vertical Pixels" />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={10}>
        <MapWithImage
          ref={mapRef}
          showMap={false}
          imageUrl={row.imageUrl}
          imageBounds={[[row.upper, row.left], [row.lower, row.right]]}
        >
          <MarkedPoint
            key='anchor'
            location={[anchor.lat, anchor.lng]}
            setLocation={p => {
              const x = (p[1] - row.left) / (row.right - row.left) * imageSize.x;
              const y = (p[0] - row.lower) / (row.upper - row.lower) * imageSize.y;
              setAnchor({ lat: p[0], lng: p[1], x, y });
            }}
            locationToShow={pointLatLngToMeters(anchor)}
          >
          </MarkedPoint>
          <ChosenMarker
            key='chosen'
            center={anchor}
          />
          <MarkedPoint
            key='horiz'
            location={[horizontalPoint.lat, horizontalPoint.lng]}
            setLocation={p => {
              const xmeters = p[1] - anchor.lng;
              const x = xmeters / (row.right - row.left) * imageSize.x;
              setDistPixels({ ...distPixels, x })
              setDistMeters({ ...distMeters, lng: xmeters })
            }}
            locationToShow={pointLatLngToMeters(horizontalPoint)}
          >
          </MarkedPoint>
          <MarkedPoint
            key='verti'
            location={[verticalPoint.lat, verticalPoint.lng]}
            setLocation={p => {
              const ymeters = p[0] - anchor.lat;
              const y = ymeters / (row.upper - row.lower) * imageSize.y;
              setDistPixels({ ...distPixels, y })
              setDistMeters({ ...distMeters, lat: ymeters })
            }}
            locationToShow={pointLatLngToMeters(verticalPoint)}
          >
          </MarkedPoint>
          <DashedPolyline
            positions={[verticalPoint, anchor, horizontalPoint]}
          >
          </DashedPolyline>
        </MapWithImage>
      </Grid>
    </Grid >
  )
}

const MapsEmbedded = ({ row, setRow }) => {
  const mapRef = React.useRef(null);

  const imageSize = { x: row.width || 300, y: row.height || 400 };
  const hasNans = [row.lower, row.upper, row.left, row.right].findIndex(x => !Number.isFinite(x)) !== -1;

  const [controlPoints, setControlPoints] = useState([
    { lat: row.upper, lng: row.left, x: 0, y: 0 },
    { lat: row.lower, lng: row.right, x: imageSize.x, y: imageSize.y },
  ]);

  const [dragOnMap, setDragOnMap] = useState(true);
  const [selectedControlPoint, setSelectedControlPoint] = useState(0);

  const changeControlPoint = (point, index) => {
    const newpoints = controlPoints.slice();
    newpoints[index] = point;
    const box = calcBoxFromPoints(newpoints[0], newpoints[1], imageSize);
    if (!box) return box;
    setControlPoints(newpoints);
    setRow(Object.assign({}, row, box));
    setTimeout(() => {
      fitBounds(box);
    }, 200);
    return true;
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

  const fitBounds = ((box) => {
    mapRef.current.leafletElement.fitBounds([[box.lower, box.left], [box.upper, box.right]]);
  });

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
              onClick={() => fitBounds(row)}
              variant='contained'
              color='primary'
            >
              Center image
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={10}>
        <MapWithImage
          ref={mapRef}
          showMap={true}
          imageUrl={row.imageUrl}
          imageBounds={hasNans ? null : [[row.upper, row.left], [row.lower, row.right]]}
        >
          <PointsWithLine
            controlPoints={controlPoints}
            selectedControlPoint={selectedControlPoint}
            setSelectedControlPoint={setSelectedControlPoint}
            onPointMove={(p, pointIndex) => {
              if (dragOnMap) {
                return changeControlPoint({ ...controlPoints[pointIndex], lat: p[0], lng: p[1] }, pointIndex);
              } else {
                const y = (p[0] - row.upper) / (row.lower - row.upper) * imageSize.y;
                const x = (p[1] - row.left) / (row.right - row.left) * imageSize.x;
                return changeControlPoint({ lat: p[0], lng: p[1], x: x, y: y }, pointIndex);
              }
            }}
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
          </PointsWithLine>
        </MapWithImage>
      </Grid>
    </Grid>
  )
}

export const MapsEditDetails = ({ row, setRow }) => {
  if (row.embedded) {
    return (
      <MapsEmbedded row={row} setRow={setRow} />
    )
  } else {
    return (
      <MapStandalone row={row} setRow={setRow} />
    )
  }
}
