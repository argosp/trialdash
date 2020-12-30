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

const RealMapLayer = () => {
    const mapAttrib = process.env.REACT_APP_MAP_ATTRIBUTION || '&copy; <a href="https://carto.com">Carto</a> contributors';
    const mapTileUrl = process.env.REACT_APP_MAP_URL || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';
    if (!process.env.REACT_APP_MAP_ATTRIBUTION || !process.env.REACT_APP_MAP_URL) {
        console.log('Getting map tileserver url from hardcoded:', mapTileUrl);
    }

    return (
        <TileLayer
            attribution={mapAttrib}
            url={mapTileUrl}
        />
    )
}

const EmbeddedImageLayer = ({ image }) => (
    <ImageOverlay
        url={config.url + '/' + image.imageUrl}
        bounds={[[image.upper, image.left], [image.lower, image.right]]}
    />
)

const RealMapWithImagesLayer = ({ images }) => (
    <>
        <RealMapLayer />
        {
            images.map(row => (
                <EmbeddedImageLayer image={row} />
            ))
        }
    </>
)

const DeviceMapLayers = ({ embedded, standalone }) => {
    if (!standalone.length) {
        return <RealMapWithImagesLayer images={embedded} />
    }
    return (
        <LayersControl position="topright" collapsed={false}>
            {
                !embedded.length ? null :
                    <LayersControl.BaseLayer name="Map" checked={true}>
                        <LayerGroup>
                            <RealMapWithImagesLayer images={embedded} />
                        </LayerGroup>
                    </LayersControl.BaseLayer>
            }
            {
                standalone.map((row, i) => (
                    <LayersControl.BaseLayer
                        name={row.imageName}
                        checked={embedded.length === 0 && i === 0}
                    >
                        <EmbeddedImageLayer image={row} />
                    </LayersControl.BaseLayer>
                ))
            }
        </LayersControl>
    )
}

export const DeviceMap = ({ onClick, onMouseMove, onMouseOut, experimentDataMaps, children }) => {
    const mapElement = React.useRef(null);

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
            <DeviceMapLayers embedded={embedded} standalone={standalone} />
            {children}
        </LeafletMap>
    );
}