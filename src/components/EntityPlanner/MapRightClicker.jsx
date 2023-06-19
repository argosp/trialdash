import React, { useEffect, useState } from 'react';
import {
    useMap,
} from "react-leaflet";

export const MapRightClicker = ({ selection, positionTopOfStack }) => {
    const mapObj = useMap();
    useEffect(() => {
        mapObj.contextmenu.removeAllItems();
        mapObj.contextmenu.addItem({
            text: 'Place top point here',
            callback: (e) => {
                positionTopOfStack([e.latlng.lat, e.latlng.lng], selection);
            },
        });
    }, [selection]);

    return null;
}