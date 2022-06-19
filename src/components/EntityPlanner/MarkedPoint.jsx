import React from 'react';
import { Marker, Popup } from "react-leaflet";
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

let dragStartLoc;

export const MarkedPoint = (props) => {
    const { location, dragLocation, setLocation, locationToShow } = props;

    let locationToShowStr;
    if (!locationToShow) {
        locationToShowStr = JSON.stringify(location.map(l => Math.round(l * 1e9) / 1e9)).replace(/,/g, ', ');
    } else {
        locationToShowStr = locationToShow;
    }
    return (
        <Marker
            position={location}
            title={locationToShowStr.replace(/<br\/>/g, '\n')}
            draggable={true}
            ondrag={(e) => {
                if (dragLocation) {
                    dragLocation(Object.values(e.target.getLatLng()));
                }
            }}
            ondragend={(e) => {
                if (setLocation) {
                    const res = setLocation(Object.values(e.target.getLatLng()));
                    if (dragStartLoc && res === false) { // when setLocation returns false - revert to last position
                        e.target.setLatLng(dragStartLoc);
                    }
                }
                dragStartLoc = undefined;
            }}
            ondragstart={(e) => {
                dragStartLoc = e.target.getLatLng();
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
                {locationToShowStr.split('<br/>').map(l => (
                    <>{l}<br /></>
                ))}
            </Popup>
        </Marker >
    )
}
