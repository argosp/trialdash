import React, { useEffect, useRef } from 'react';
import { Marker, Popup, withLeaflet } from "react-leaflet";
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../assets/fontawesome/css/all.css';

export const EntityMarker = withLeaflet(({ entity, devLocation, isSelected, isTypeSelected, shouldShowName, onClick, leaflet }) => {
    const ref = useRef(null);
    const leafletElement = ref && ref.current && ref.current.leafletElement ? ref.current.leafletElement : undefined;
    useEffect(() => {
        leafletElement && leafletElement.off('click');
    }, [leafletElement]);

    return (
        <Marker key={entity.name}
            position={devLocation}
            title={entity.name}
            icon={divIcon({
                className: 'argos-leaflet-div-icon',
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
            onclick={() => onClick()}
            oncontextmenu={() => leafletElement.openPopup()}
            ref={ref}
        >
            <Popup>
                {entity.name + ' at (' + devLocation + ')'}
            </Popup>
        </Marker >
    )
})
