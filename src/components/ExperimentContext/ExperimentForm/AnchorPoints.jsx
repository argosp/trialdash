import React from "react";
import { MarkedPoint } from "../../EntityPlanner/MarkedPoint.jsx";
import { ChosenMarker } from "./ChosenMarker.jsx";
import { DashedPolyline } from "./DashedPolyline.jsx";


// const pointLatLngToMeters = (p) => {
//     const fix = (n) => Math.round(n * 1e9) / 1e9;
//     return `(${fix(p.lng)}, ${fix(p.lat)}) in meters<br/>(${fix(p.x)}, ${fix(p.y)}) in pixels`;
// }

export const AnchorPoints = ({ anchorLatLng, horizontalLng, verticalLat, setAnchorLatLng, setHorizontalLng, setVerticalLat }) => {
    const anchorPoint = [anchorLatLng.lat, anchorLatLng.lng];
    const horizontalPoint = [anchorLatLng.lat, horizontalLng];
    const verticalPoint = [verticalLat, anchorLatLng.lng];

    // console.log(verticalPoint, anchorPoint, horizontalPoint);

    return (
        <>
            <MarkedPoint
                key='anchor'
                location={anchorPoint}
                setLocation={p => setAnchorLatLng({ lat: p[0], lng: p[1] })}
            // locationToShow={pointLatLngToMeters(anchor)}
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
            // locationToShow={pointLatLngToMeters(horizontalPoint)}
            >
            </MarkedPoint>
            <MarkedPoint
                key='verti'
                location={verticalPoint}
                setLocation={p => setVerticalLat(p[0])}
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