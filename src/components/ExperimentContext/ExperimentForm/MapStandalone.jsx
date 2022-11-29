import React, { useState } from "react";
import {
  Grid,
} from '@material-ui/core';
import { MapWithImage } from "./MapWithImage";
import { AnchorPoints } from "./AnchorPoints.jsx";
import { InputXY } from "./InputXY.jsx";

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
    if (Math.min(Math.abs(distances.x), Math.abs(distances.y), Math.abs(distances.lat), Math.abs(distances.lng)) < 1e-6) {
      return;
    }

    const right = Math.round((anchor.lng + dlng / distances.x * (imageSize.x - anchor.x)) * 1e9) / 1e9;
    const left = Math.round((horizontalPoint.lng - dlng / distances.x * horizontalPoint.x) * 1e9) / 1e9;
    const lower = Math.round((anchor.lat - dlat / distances.y * anchor.y) * 1e9) / 1e9;
    const upper = Math.round((verticalPoint.lat + dlat / distances.y * (imageSize.y - verticalPoint.y)) * 1e9) / 1e9;

    if (Math.max(Math.abs(right - row.right), Math.abs(left - row.left), Math.abs(lower - row.lower), Math.abs(upper - row.upper)) < 1e-6) {
      return;
    }

    // console.log('right', right, row.right);
    // console.log('left', left, row.left);
    // console.log('lower', lower, row.lower);
    // console.log('upper', upper, row.upper);

    setRow(Object.assign({}, row, { lower, right, upper, left }));
    setTimeout(() => {
      mapRef.current.leafletElement.fitBounds([[lower, left], [upper, right]]);
    }, 200);
  });

  return (
    <Grid container>
      <Grid item xs={3}>
        <Grid container direction="column"
          justify="flex-start"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            Image size: ({imageSize.x} x {imageSize.y}) <br />
          </Grid>
          <Grid item>
            <InputXY
              name="Anchor" units="meters"
              x={anchor.lng} setX={(num) => setAnchor({ ...anchor, lng: num })}
              y={anchor.lat} setY={(num) => setAnchor({ ...anchor, lat: num })}
            ></InputXY>
          </Grid>
          <Grid item>
            <InputXY
              name="Anchor" units="pixels"
              x={anchor.x} setX={(num) => setAnchor({ ...anchor, x: num })}
              y={anchor.y} setY={(num) => setAnchor({ ...anchor, y: num })}
            ></InputXY>
          </Grid>
          <Grid item>
            <InputXY
              name="Span" units="meters"
              x={distances.lng} setX={(num) => {
                const lng = Math.abs(num);
                if (lng > 1e-6) {
                  const lat = distances.lat / distances.lng * lng;
                  setDistances({ ...distances, lat, lng });
                }
              }}
              y={distances.lat} setY={(num) => {
                const lat = Math.abs(num);
                if (lat > 1e-6) {
                  const lng = distances.lng / distances.lat * lat;
                  setDistances({ ...distances, lat, lng });
                }
              }}
            ></InputXY>
          </Grid>
          <Grid item>
            <InputXY
              name="Span" units="pixels"
              x={distances.x} setX={(num) => setDistances({ ...distances, x: num })}
              y={distances.y} setY={(num) => setDistances({ ...distances, y: num })}
            ></InputXY>
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
          <AnchorPoints
            anchorLatLng={{ lat: anchor.lat, lng: anchor.lng }}
            horizontalLng={horizontalPoint.lng}
            verticalLat={verticalPoint.lat}
            setAnchorLatLng={({ lat, lng }) => {
              const x = (lng - row.left) / (row.right - row.left) * imageSize.x;
              const y = (lat - row.lower) / (row.upper - row.lower) * imageSize.y;
              setAnchor({ lat, lng, x, y });
            }}
            setHorizontalLng={lng => {
              const xmeters = lng - anchor.lng;
              const x = xmeters / (row.right - row.left) * imageSize.x;
              setDistances({ ...distances, x, lng: Math.abs(xmeters) })
            }}
            setVerticalLat={lat => {
              const ymeters = lat - anchor.lat;
              const y = ymeters / (row.upper - row.lower) * imageSize.y;
              setDistances({ ...distances, y, lat: Math.abs(ymeters) })
            }}
          ></AnchorPoints>
        </MapWithImage>
      </Grid>
    </Grid >
  )
}