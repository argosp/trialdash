import React from 'react';
import { Marker, Popup } from "react-leaflet";
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

export const EntityMarker = ({ entity, devLocation, isSelected, isTypeSelected, shouldShowName, handleMarkerClick }) => (
    <Marker key={entity.name}
        position={devLocation}
        onclick={() => handleMarkerClick(entity)}
        title={entity.name}
        icon={divIcon({
            iconSize: [20, 20],
            iconAnchor: [10, 22],
            html: renderToStaticMarkup(
                <div>
                    <i className="fas fa-circle fa-lg"
                        style={{ color: (isTypeSelected ? (isSelected ? '#9B51E0' : '#2D9CDB') : '#27AE60') }}
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
