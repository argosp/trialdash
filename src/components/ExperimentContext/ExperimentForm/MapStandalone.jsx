import React, { useState } from "react";
import {
  Grid,
} from '@material-ui/core';
import { MarkedPoint } from "../../EntityPlanner/MarkedPoint";
import { MapWithImage } from "./MapWithImage";
import { NumberTextField } from "./NumberTextField";
import { DashedPolyline } from "./DashedPolyline";
import { ChosenMarker } from "./ChosenMarker";

const pointLatLngToMeters = (p) => {
  const fix = (n) => Math.round(n * 1e9) / 1e9;
  return `(${fix(p.lng)}, ${fix(p.lat)}) in meters<br/>(${fix(p.x)}, ${fix(p.y)}) in pixels`;
}

const roundDec = (num) => {
  return num;//Math.round(num * 10) / 10;
}

const roundDigits = (num, decimalPlaces) => {
  var p = Math.pow(10, decimalPlaces);
  return Math.round(num * p) / p;
}

export const MapStandalone = ({ row, setRow }) => {
  const mapRef = React.useRef(null);

  const imageSize = { x: row.width || 300, y: row.height || 400 };

  const [anchor, setAnchor] = useState({
    lat: row.lower,
    lng: row.left,
    x: 0,
    y: 0
  });

  const [distances, setDistances] = useState({
    x: imageSize.x,
    y: imageSize.y,
    lat: row.upper - row.lower,
    lng: row.right - row.left
  });

  React.useEffect(() => {
    mapRef.current.leafletElement.fitBounds([[row.lower, row.left], [row.upper, row.right]]);
  }, []);

  const dlat = Math.abs(distances.lat) * Math.sign(distances.y);
  const dlng = Math.abs(distances.lng) * Math.sign(distances.x);
  const horizontalPoint = { lat: anchor.lat, lng: anchor.lng + dlng, x: anchor.x + distances.x, y: anchor.y };
  const verticalPoint = { lat: anchor.lat + dlat, lng: anchor.lng, x: anchor.x, y: anchor.y + distances.y };

  React.useEffect(() => {
    // check zero division
    if (Math.min(Math.abs(distances.x), Math.abs(distances.y), Math.abs(distances.lat), Math.abs(distances.lng)) < 1e-6) {
      return;
    }

    // compute new bounds
    const right = roundDigits(anchor.lng + dlng * (imageSize.x - anchor.x) / distances.x, 9);
    const left = roundDigits(horizontalPoint.lng - dlng / distances.x * horizontalPoint.x, 9);
    const lower = roundDigits(anchor.lat - dlat / distances.y * anchor.y, 9);
    const upper = roundDigits(verticalPoint.lat + dlat / distances.y * (imageSize.y - verticalPoint.y), 9);

    // check bounds are changed from previous
    const dright = Math.abs(right - row.right);
    const dleft = Math.abs(left - row.left);
    const dlower = Math.abs(lower - row.lower);
    const dupper = Math.abs(upper - row.upper);
    if (Math.max(dright, dleft, dlower, dupper) < 1e-6) {
      return;
    }

    // console.log('right', right, row.right);
    // console.log('left', left, row.left);
    // console.log('lower', lower, row.lower);
    // console.log('upper', upper, row.upper);

    // assign new bounds
    setRow(Object.assign({}, row, { lower, right, upper, left }));
    setTimeout(() => {
      mapRef.current.leafletElement.fitBounds([[lower, left], [upper, right]]);
    }, 200);
  });

  return (
    <Grid container>
      <Grid item xs={3}>
        <Grid container direction="column"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            Image size: ({imageSize.x} x {imageSize.y}) <br />
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <NumberTextField value={roundDec(anchor.lng)} onChange={(num) => setAnchor({ ...anchor, lng: num })} label="Anchor X meters" width='150px' />
              </Grid>
              <Grid item>
                <NumberTextField value={roundDec(anchor.lat)} onChange={(num) => setAnchor({ ...anchor, lat: num })} label="Anchor Y meters" width='150px' />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <NumberTextField value={roundDec(anchor.x)} onChange={(num) => setAnchor({ ...anchor, x: num })} label="Anchor X pixels" width='150px' />
              </Grid>
              <Grid item>
                <NumberTextField value={roundDec(anchor.y)} onChange={(num) => setAnchor({ ...anchor, y: num })} label="Anchor Y pixels" width='150px' />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <NumberTextField value={roundDec(distances.lng)}
                  label="Span X Meters" width='150px'
                  onChange={(num) => {
                    const lng = Math.abs(num);
                    if (lng > 1e-6) {
                      const lat = distances.lat / distances.lng * lng;
                      setDistances({ ...distances, lat, lng });
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <NumberTextField value={roundDec(distances.x)}
                  label="Span X Pixels" width='150px'
                  onChange={(num) => setDistances({ ...distances, x: num })}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <NumberTextField value={roundDec(distances.lat)}
                  label="Span Y Meters" width='150px'
                  onChange={(num) => {
                    const lat = Math.abs(num);
                    if (lat > 1e-6) {
                      const lng = distances.lng / distances.lat * lat;
                      setDistances({ ...distances, lat, lng });
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <NumberTextField value={roundDec(distances.y)}
                  label="Span Y Pixels" width='150px'
                  onChange={(num) => setDistances({ ...distances, y: num })}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={9}>
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
              // console.log(xmeters, x, distances);
              // console.log(row);
              setDistances({ ...distances, x, lng: Math.abs(xmeters) });
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
              // console.log(ymeters, y, distances);
              setDistances({ ...distances, y, lat: Math.abs(ymeters) });
              // setRow({...row, })
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