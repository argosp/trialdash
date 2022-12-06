import React, { useState } from "react";
import {
  Grid,
} from '@material-ui/core';
import { MapWithImage } from "./MapWithImage";
import { InputXY } from "./InputXY.jsx";
import { AnchorPointsOrtho } from "./AnchorPointsOrtho.jsx";

export const MapStandalone = ({ row, setRow }) => {
  const mapRef = React.useRef(null);

  const imageSize = { x: row.width || 300, y: row.height || 400 };

  const [anchor, setAnchor] = useState({ lat: row.lower, lng: row.left, x: 0, y: 0 });
  const [horizontalPoint, setHorizontalPoint] = useState({ lat: row.lower, lng: row.right, x: imageSize.x, y: 0 });
  const [verticalPoint, setVerticalPoint] = useState({ lat: row.upper, lng: row.left, x: 0, y: imageSize.y });

  const round9 = (n) => Math.round(n * 1e9) / 1e9;

  React.useEffect(() => {
    mapRef.current.leafletElement.fitBounds([[row.lower, row.left], [row.upper, row.right]]);
  }, [row]);

  const setPointWithoutChange = (setter, lat, lng) => {
    const x = (lng - row.left) / (row.right - row.left) * imageSize.x;
    const y = (lat - row.lower) / (row.upper - row.lower) * imageSize.y;
    setter({ lat, lng, x, y });
  }

  console.log(anchor, horizontalPoint, verticalPoint);

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
              name="Span" units="meters"
              x={horizontalPoint.lng - anchor.lng}
              setX={(dlng) => {
                const dx = horizontalPoint.x - anchor.x;
                if (Math.abs(dlng) > 1e-3 && Math.abs(dx) > 1e-3) {
                  const lng = dlng + anchor.lng;
                  const left = round9(anchor.lng - anchor.x / dx * dlng);
                  const right = round9(anchor.lng + (imageSize.x - anchor.x) / dx * dlng);
                  setRow({ ...row, left, right });
                  setHorizontalPoint({ ...horizontalPoint, lng });
                }
              }}
              y={verticalPoint.lat - anchor.lat}
              setY={(dlat) => {
                const dy = verticalPoint.y - anchor.y;
                if (Math.abs(dlat) > 1e-3 && Math.abs(dy) > 1e-3) {
                  const lat = dlat + anchor.lat;
                  const lower = round9(anchor.lat - anchor.y / dy * dlat);
                  const upper = round9(anchor.lat + (imageSize.y - anchor.y) / dy * dlat);
                  setRow({ ...row, lower, upper });
                  setVerticalPoint({ ...verticalPoint, lat });
                }
              }}
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
          <AnchorPointsOrtho
            anchorLatLng={{ lat: anchor.lat, lng: anchor.lng }}
            horizontalLng={horizontalPoint.lng}
            verticalLat={verticalPoint.lat}
            anchorXY={{ x: anchor.x, y: anchor.y }}
            horizontalX={horizontalPoint.x}
            verticalY={verticalPoint.y}
            setHorizontalLng={lng => setPointWithoutChange(setHorizontalPoint, anchor.lat, lng)}
            setVerticalLat={lat => setPointWithoutChange(setVerticalPoint, lat, anchor.lng)}
            setAnchorLatLng={({ lat, lng }) => setPointWithoutChange(setAnchor, lat, lng)}
          ></AnchorPointsOrtho>
        </MapWithImage>
      </Grid>
    </Grid >
  )
}