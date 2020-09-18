import React from 'react';
import { Polyline } from "react-leaflet";
import { MarkedPoint } from './MarkedPoint';
import { polylineDistance, distToText } from './GeometryUtils';

export const MarkedShape = ({ markedPoints, setMarkedPoints, shape, shapeCreator }) => {
    const currPolyline = React.useRef(null);
    const auxPolyline = React.useRef(null);

    const setLatLngsWithDist = (leafletElement, points) => {
        leafletElement.setLatLngs(points);
        const dist = polylineDistance(leafletElement.getLatLngs());
        if (dist > 0) {
            leafletElement.bindTooltip(distToText(dist)).openTooltip();
        }
    };

    const renderShape = (points) => {
        points = points || markedPoints;
        if (!points.length) return;
        const shownPolylines = shapeCreator.toLine(points);
        setLatLngsWithDist(currPolyline.current.leafletElement, shownPolylines[0]);
        if (shape === 'Arc') {
            setLatLngsWithDist(auxPolyline.current.leafletElement, shownPolylines.length > 1 ? shownPolylines[1] : []);
        }
    };

    React.useEffect(() => {
        renderShape();
    });

    return (
        <>
            {
                markedPoints.map((p, i) => (
                    <MarkedPoint
                        location={p}
                        setLocation={(latlng) => {
                            const newMarkedPoints = markedPoints.slice();
                            newMarkedPoints[i] = latlng;
                            setMarkedPoints(newMarkedPoints);
                        }}
                        dragLocation={(latlng) => {
                            const newMarkedPoints = markedPoints.slice();
                            newMarkedPoints[i] = latlng;
                            renderShape(newMarkedPoints);
                        }}
                    ></MarkedPoint>
                ))
            }
            <Polyline positions={[]} ref={currPolyline} />
            {
                shape !== 'Arc' ? null :
                    <Polyline positions={[]} ref={auxPolyline} />
            }
        </>
    )
}