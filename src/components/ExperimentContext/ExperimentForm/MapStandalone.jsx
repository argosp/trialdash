import React, { useState } from "react";
import {
  Grid,
} from '@material-ui/core';
import { MapWithImage } from "./MapWithImage";
// import { InputXY } from "./InputXY.jsx";
import { AnchorPointsDiagonal } from "./AnchorPointsDiagonal.jsx";
import { NumberTextField } from "./NumberTextField.jsx";

export const MapStandalone = ({ row, setRow }) => {
  const mapRef = React.useRef(null);

  const imageSize = { x: row.width || 300, y: row.height || 400 };

  const [anchor, setAnchor] = useState({ lat: row.lower, lng: row.left, x: 0, y: 0 });
  const [anotherPoint, setAnotherPoint] = useState({ lat: row.lower, lng: row.right, x: imageSize.x, y: 0 });

  const round9 = (n) => Math.round(n * 1e9) / 1e9;

  const roundDec = (num) => {
    return Math.round(num * 1000) / 1000;
  }

  React.useEffect(() => {
    mapRef.current.leafletElement.fitBounds([[row.lower, row.left], [row.upper, row.right]]);
  }, [row]);

  const setPointWithoutChange = (setter, lat, lng) => {
    const x = (lng - row.left) / (row.right - row.left) * imageSize.x;
    const y = (lat - row.lower) / (row.upper - row.lower) * imageSize.y;
    setter({ lat, lng, x, y });
  }

  const distLatLng = (p0, p1) => {
    return Math.sqrt(Math.pow(p0.lat - p1.lat, 2) + Math.pow(p0.lng - p1.lng, 2));
  }

  // const distXY = (p0, p1) => {
  //   return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
  // }

  const changeDist = (newDist) => {
    const dx = anotherPoint.x - anchor.x;
    const dy = anotherPoint.y - anchor.y;
    if (newDist > 1e-3 && Math.abs(dx) > 1e-3 && Math.abs(dy) > 1e-3) {
      const oldDist = distLatLng(anchor, anotherPoint);
      const dlng = (anotherPoint.lng - anchor.lng) * newDist / oldDist;
      const dlat = (anotherPoint.lat - anchor.lat) * newDist / oldDist;
      const left = round9(anchor.lng - anchor.x / dx * dlng);
      const right = round9(anchor.lng + (imageSize.x - anchor.x) / dx * dlng);
      const lower = round9(anchor.lat - anchor.y / dy * dlat);
      const upper = round9(anchor.lat + (imageSize.y - anchor.y) / dy * dlat);
      setRow({ ...row, lower, upper, left, right });
      const lng = anchor.lng + dlng;
      const lat = anchor.lat + dlat;
      setAnotherPoint({ ...anotherPoint, lng, lat });
    }
  }

  console.log(anchor, anotherPoint);

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
            <NumberTextField
              value={roundDec(distLatLng(anchor, anotherPoint))}
              onChange={(newDist) => changeDist(newDist)}
              label={"Span in meters"}
              width='150px'
            />
            {/* <InputXY
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
            ></InputXY> */}
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
          <AnchorPointsDiagonal
            anchorLatLng={{ lat: anchor.lat, lng: anchor.lng }}
            anotherLatLng={{ lat: anotherPoint.lat, lng: anotherPoint.lng }}
            anchorXY={{ x: anchor.x, y: anchor.y }}
            anotherXY={{ x: anotherPoint.x, y: anotherPoint.y }}
            setAnchorLatLng={({ lat, lng }) => setPointWithoutChange(setAnchor, lat, lng)}
            setAnotherLatLng={({ lat, lng }) => setPointWithoutChange(setAnotherPoint, lat, lng)}
          ></AnchorPointsDiagonal>
        </MapWithImage>
      </Grid>
    </Grid >
  )
}