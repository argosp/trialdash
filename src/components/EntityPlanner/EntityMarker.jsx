import React from 'react';
import { Marker, Popup } from "react-leaflet";
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

export const EntityMarker = ({ entity, devLocation, isSelected, isTypeSelected, shouldShowName,handleMarkerClick }) => (
    <Marker key={entity.name}
        position={devLocation}
        onclick={() => handleMarkerClick(entity)}
        title={entity.name}
        icon={divIcon({
            iconSize: [20, 20],
            iconAnchor: [10, 22],
            html: renderToStaticMarkup(
                <div>
                    <i className=" fa fa-map-marker-alt fa-2x"
                        style={{ color: (isTypeSelected ? (isSelected ? '#297A31' : '#1B2C6F') : '#888888') }}
                    />
                    {!shouldShowName ? null :
                        <span style={{ backgroundColor: "yellow", padding: 3, borderColor: "black" }}>
                            {entity.name.replace(/ /g, '\u00a0')}
                        </span>
                    }
                </div>
            )
        })}
    >
        <Popup>
            {entity.name + ' at (' + devLocation + ')'}
        </Popup>
    </Marker >
)
