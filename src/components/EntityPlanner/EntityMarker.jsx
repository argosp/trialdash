import React, { useEffect, useRef } from 'react';
import { Marker, Popup } from "react-leaflet";
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import '../../assets/fontawesome/css/all.css';
import { SingleEntityPropertiesView } from './SingleEntityPropertiesView';
import { usePopupSwitch } from './PopupSwitchContext';

export const EntityMarker = ({ entityItem, entityType, devLocation, isSelected, isTypeSelected, shouldShowName, onClick, children }) => {
    const ref = useRef(null);

    const { isPopupSwitchedTo } = usePopupSwitch();

    useEffect(() => {
        if (isPopupSwitchedTo(entityItem.key)) {
            ref.current.openPopup();
        }
    })

    return (
        <Marker
            key={entityItem.name}
            position={devLocation}
            title={entityItem.name}
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
                                {entityItem.name.replace(/ /g, '\u00a0')}
                            </span>
                        }
                    </div>
                )
            })}
            ref={ref}
            eventHandlers={{
                click: () => {
                    ref.current.closePopup();
                    onClick();
                },
                contextmenu: () => {
                    ref.current.openPopup();
                }
            }}
        >
            <Popup >
                <SingleEntityPropertiesView
                    entityItem={entityItem}
                    entityType={entityType}
                    devLocation={devLocation}
                >
                    {children}
                </SingleEntityPropertiesView>
            </Popup>
        </Marker >
    )
}
