import React from 'react';
import { Marker, Popup } from "react-leaflet";
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

export const DeviceMarker = ({ device, devLocation, isSelected, isTypeSelected, shouldShowName }) => (
    <Marker key={device.name}
        position={devLocation}
        title={device.name}
        icon={divIcon({
            iconSize: [20, 20],
            html: renderToStaticMarkup(
                <div>
                    <i className=" fa fa-map-marker-alt fa-2x"
                        style={{ color: (isTypeSelected ? (isSelected ? '#297A31' : '#1B2C6F') : '#888888') }}
                    />
                    {!shouldShowName ? null :
                        <span style={{ backgroundColor: "yellow", padding: 3, borderColor: "black" }}>
                            {device.name.replace(/ /g, '\u00a0')}
                        </span>
                    }
                </div>
            )
        })}
    >
        <Popup>
            {device.name + ' at (' + devLocation + ')'}
        </Popup>
    </Marker >
)
