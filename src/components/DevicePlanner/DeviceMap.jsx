import React, { useState } from 'react';
import {
    Map as LeafletMap,
    TileLayer,
    LayersControl,
    ImageOverlay,
    LayerGroup
} from "react-leaflet";
import config from '../../config';
import { L } from 'leaflet';

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
        <RealMapLayer key={'real'} />
        {
            images.map((row, i) => (
                <EmbeddedImageLayer image={row} key={'l' + i} />
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
            <LayersControl.BaseLayer name="OSMMap" checked={true}>
                <LayerGroup>
                    <RealMapWithImagesLayer images={embedded} />
                </LayerGroup>
            </LayersControl.BaseLayer>
            {
                standalone.map((row, i) => (
                    <LayersControl.BaseLayer
                        key={row.imageName}
                        name={row.imageName}
                    >
                        <EmbeddedImageLayer image={row} />
                    </LayersControl.BaseLayer>
                ))
            }
        </LayersControl>
    )
}

export const DeviceMap = ({ onClick, onMouseMove, onMouseOut, experimentDataMaps, children, layerChosen, setLayerChosen }) => {
    const mapElement = React.useRef(null);

    const images = experimentDataMaps || [];
    const embedded = images.filter(row => row.embedded);
    const standalone = images.filter(row => !row.embedded);

    React.useEffect(() => {
        mapElement.current.leafletElement.invalidateSize();
        mapElement.current.leafletElement.on('baselayerchange', function (e) {
            setLayerChosen(e.name);
        });
        if (!layerChosen) {
            if (!standalone.length || embedded.length) {
                setLayerChosen('OSMMap');
            } else {
                setLayerChosen(standalone[0].imageName);
            }
        }
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
            <DeviceMapLayers embedded={embedded} standalone={standalone} onLayerChange={(layerName) => setLayerChosen(layerName)} />
            {children}
        </LeafletMap>
    );
}