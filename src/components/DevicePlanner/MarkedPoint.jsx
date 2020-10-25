import React from 'react';
import { Marker, Popup } from "react-leaflet";
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

export const MarkedPoint = (props) => {
    const { location, dragLocation, setLocation } = props;
    const formatLoc = (loc) => {
        return JSON.stringify(loc.map(l => Math.round(l * 1e9) / 1e9)).replace(',', ', ');
    }
    return (
        <Marker key={location}
            position={location}
            title={formatLoc(location)}
            draggable={true}
            ondrag={(e) => {
                if (dragLocation) {
                    dragLocation(Object.values(e.target.getLatLng()))
                }
            }}
            ondragend={(e) => {
                if (setLocation) {
                    setLocation(Object.values(e.target.getLatLng()))
                }
            }}
            icon={divIcon({
                iconSize: [20, 20],
                html: renderToStaticMarkup(
                    <div>
                        <i className="fas fa-crosshairs"></i>
                    </div>
                ),
                iconAnchor: [6, 9]
            })}
            {...props}
        >
            <Popup permanent>
                {formatLoc(location)}
            </Popup>
        </Marker >
    )
}
