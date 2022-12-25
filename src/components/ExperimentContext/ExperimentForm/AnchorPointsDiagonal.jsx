import React from "react";
import { MarkedPoint } from "../../EntityPlanner/MarkedPoint.jsx";
import { ChosenMarker } from "./ChosenMarker.jsx";
import { DashedPolyline } from "./DashedPolyline.jsx";

export const AnchorPointsDiagonal = ({
  anchorLatLng,
  anotherLatLng,
  setAnchorLatLng,
  setAnotherLatLng,
  anchorXY,
  anotherXY,
}) => {
  const anchorPoint = [anchorLatLng.lat, anchorLatLng.lng];
  const anotherPoint = [anotherLatLng.lat, anotherLatLng.lng];

  const round9 = (n) => Math.round(n * 1e9) / 1e9;
  // console.log(verticalPoint, anotherPoint);

  return (
    <>
      <MarkedPoint
        key="anchor"
        location={anchorPoint}
        setLocation={(p) => setAnchorLatLng({ lat: p[0], lng: p[1] })}
        locationToShow={`(${round9(anchorLatLng.lng)}, ${round9(
          anchorLatLng.lat
        )}) in meters<br/>(${round9(anchorXY.x)}, ${round9(
          anchorXY.y
        )}) in pixels`}
      ></MarkedPoint>
      <ChosenMarker key="chosen" center={anchorPoint} />
      <MarkedPoint
        key="another"
        location={anotherPoint}
        setLocation={(p) => setAnotherLatLng({ lat: p[0], lng: p[1] })}
        locationToShow={`(${round9(anotherLatLng.lng)}, ${round9(
          anotherLatLng.lat
        )}) in meters<br/>(${round9(anotherXY.x)}, ${round9(
          anotherXY.y
        )}) in pixels`}
      ></MarkedPoint>
      <DashedPolyline positions={[anchorPoint, anotherPoint]}></DashedPolyline>
    </>
  );
};
