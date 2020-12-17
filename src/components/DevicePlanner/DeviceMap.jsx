import React, { useState } from 'react';
import {
    Map as LeafletMap,
    TileLayer,
    LayersControl,
    ImageOverlay,
    LayerGroup
} from "react-leaflet";
import config from '../../config';

const position = [32.081128, 34.779729];

export const DeviceMap = ({ onClick, onMouseMove, onMouseOut, experimentDataMaps, children }) => {
    const mapElement = React.useRef(null);

    const mapAttrib = process.env.REACT_APP_MAP_ATTRIBUTION || '&copy; <a href="https://carto.com">Carto</a> contributors';
    const mapTileUrl = process.env.REACT_APP_MAP_URL || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';
    if (!process.env.REACT_APP_MAP_ATTRIBUTION || !process.env.REACT_APP_MAP_URL) {
        console.log('Getting map tileserver url from hardcoded:', mapTileUrl);
    }

    const images = experimentDataMaps || [];
    const embedded = images.filter(row => row.embedded);
    const standalone = images.filter(row => !row.embedded);

    React.useEffect(() => {
        mapElement.current.leafletElement.invalidateSize();
    }, []);

    return (
        <LeafletMap
            center={position}
            zoom={15}
            ref={mapElement}
            style={{ height: "100%", width: '100%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
            onClick={onClick}
            onMouseMove={onMouseMove}
            onMouseOut={onMouseOut}
        >

            <LayersControl position="topright" collapsed={false}>
                {
                    !embedded.length ? null :
                        <LayersControl.BaseLayer name="Map" checked={true}>
                            <LayerGroup>
                                <TileLayer
                                    attribution={mapAttrib}
                                    url={mapTileUrl}
                                />
                                {
                                    embedded.map(row => (
                                        <ImageOverlay
                                            url={config.url + '/' + row.imageUrl}
                                            bounds={[[row.upper, row.left], [row.lower, row.right]]}
                                        />
                                    ))
                                }
                            </LayerGroup>
                        </LayersControl.BaseLayer>
                }
                {
                    standalone.map((row, i) => (
                        <LayersControl.BaseLayer
                            name={row.imageName}
                            checked={embedded.length === 0 && i === 0}
                        >
                            <ImageOverlay
                                url={config.url + '/' + row.imageUrl}
                                bounds={[[row.upper, row.left], [row.lower, row.right]]}
                            />
                        </LayersControl.BaseLayer>
                    ))
                }
            </LayersControl>

            {children}
        </LeafletMap>
    );
}