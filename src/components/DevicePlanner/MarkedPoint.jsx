import React from 'react';
import { Marker, Popup } from "react-leaflet";
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

export const MarkedPoint = ({ location, dragLocation, setLocation }) => {
    const strLoc = JSON.stringify(location.map(l => Math.round(l * 1e9) / 1e9)).replace(',', ', ');
    return (
        <Marker key={location}
            position={location}
            title={strLoc}
            draggable={true}
            ondrag={(e) => dragLocation && dragLocation(Object.values(e.target.getLatLng()))}
            ondragend={(e) => setLocation && setLocation(Object.values(e.target.getLatLng()))}
            icon={divIcon({
                iconSize: [20, 20],
                html: renderToStaticMarkup(
                    <div>
                        <i class="fas fa-crosshairs"></i>
                    </div>
                ),
                iconAnchor: [6, 9]
            })}
        >
            <Popup>
                {strLoc}
            </Popup>
        </Marker >
    )
}
