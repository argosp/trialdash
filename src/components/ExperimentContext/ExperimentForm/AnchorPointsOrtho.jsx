import React from "react";
import { MarkedPoint } from "../../EntityPlanner/MarkedPoint.jsx";
import { ChosenMarker } from "./ChosenMarker.jsx";
import { DashedPolyline } from "./DashedPolyline.jsx";


// const pointLatLngToMeters = (p) => {
//     return `(${fix(p.lng)}, ${fix(p.lat)}) in meters<br/>(${fix(p.x)}, ${fix(p.y)}) in pixels`;
// }

export const AnchorPointsOrtho = ({ anchorLatLng,
    horizontalLng, verticalLat,
    setAnchorLatLng, setHorizontalLng, setVerticalLat,
    anchorXY, horizontalX, verticalY
}) => {
    const anchorPoint = [anchorLatLng.lat, anchorLatLng.lng];
    const horizontalPoint = [anchorLatLng.lat, horizontalLng];
    const verticalPoint = [verticalLat, anchorLatLng.lng];

    const round9 = (n) => Math.round(n * 1e9) / 1e9;
    // console.log(verticalPoint, anchorPoint, horizontalPoint);

    return (
        <>
            <MarkedPoint
                key='anchor'
                location={anchorPoint}
                setLocation={p => setAnchorLatLng({ lat: p[0], lng: p[1] })}
                locationToShow={`(${round9(anchorLatLng.lng)}, ${round9(anchorLatLng.lat)}) in meters<br/>(${round9(anchorXY.x)}, ${round9(anchorXY.y)}) in pixels`}
            >
            </MarkedPoint>
            <ChosenMarker
                key='chosen'
                center={anchorPoint}
            />
            <MarkedPoint
                key='horiz'
                location={horizontalPoint}
                setLocation={p => setHorizontalLng(p[1])}
                locationToShow={`(${round9(horizontalLng)}, ${round9(anchorLatLng.lat)}) in meters<br/>(${round9(horizontalX)}, ${round9(anchorXY.y)}) in pixels`}
            // locationToShow={pointLatLngToMeters(horizontalPoint)}
            >
            </MarkedPoint>
            <MarkedPoint
                key='verti'
                location={verticalPoint}
                setLocation={p => setVerticalLat(p[0])}
                locationToShow={`(${round9(anchorLatLng.lng)}, ${round9(verticalLat)}) in meters<br/>(${round9(anchorXY.x)}, ${round9(verticalY)}) in pixels`}
            // locationToShow={pointLatLngToMeters(verticalPoint)}
            >
            </MarkedPoint>
            <DashedPolyline
                positions={[
                    verticalPoint,
                    anchorPoint,
                    horizontalPoint
                ]}
            >
            </DashedPolyline>
        </>
    )
}