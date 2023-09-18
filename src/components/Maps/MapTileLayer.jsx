import React, { useEffect } from 'react';
import {
    TileLayer,
} from "react-leaflet";

export const MapTileLayer = () => {
    const mapAttrib = process.env.REACT_APP_MAP_ATTRIBUTION || '&copy; <a href="https://carto.com">Carto</a> contributors';
    const mapTileUrl = process.env.REACT_APP_MAP_URL || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';
    useEffect(() => {
        if (!process.env.REACT_APP_MAP_ATTRIBUTION || !process.env.REACT_APP_MAP_URL) {
            console.log('Getting map tileserver url from hardcoded:', mapTileUrl);
        }
    }, []);

    return (
        <TileLayer
            key='map'
            attribution={mapAttrib}
            url={mapTileUrl}
            maxNativeZoom={18}
            maxZoom={30}
        />
    )
}