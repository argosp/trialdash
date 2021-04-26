import React, { useState } from 'react';
import {
    Map as LeafletMap,
    TileLayer,
    LayersControl,
    ImageOverlay,
    LayerGroup,
    Polyline
} from "react-leaflet";
import config from '../../config';
import { L, latLngBounds } from 'leaflet';
import { CRS } from 'leaflet';

const position = [32.081128, 34.779729];
const posbounds = [[position[0] + 0.02, position[1] - 0.02], [position[0] - 0.02, position[1] + 0.02]];

const bounds2arr = (bounds) => {
    return [[bounds.getNorth(), bounds.getWest()], [bounds.getSouth(), bounds.getEast()]];
}

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

const createRangeArray = (from, to, delta) => {
    const ret = [];
    for (let x = from; x < to; x += delta) {
        ret.push(x);
    }
    ret.push(to);
    return ret;
}

const GridlinesLayer = ({ from, to, delta = 1 }) => {
    const lat0 = Math.min(from[0], to[0]);
    const lat1 = Math.max(from[0], to[0]);
    const lng0 = Math.min(from[1], to[1]);
    const lng1 = Math.max(from[1], to[1]);
    const lats = createRangeArray(lat0, lat1, delta);
    const lngs = createRangeArray(lng0, lng1, delta);
    return (<>
        {lats.map(lat => (
            <Polyline
                weight={0.5}
                positions={[
                    [lat, lng0],
                    [lat, lng1],
                ]}
            />
        ))}
        {lngs.map(lng => (
            <Polyline
                weight={0.5}
                positions={[
                    [lat0, lng],
                    [lat1, lng],
                ]}
            />
        ))}
    </>)
}

const DeviceMapLayers = ({ embedded, standalone, showGrid, showGridMeters }) => {
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
                        <LayerGroup>
                            <EmbeddedImageLayer image={row} />
                            {showGrid ? <GridlinesLayer
                                from={[row.lower, row.left]}
                                to={[row.upper, row.right]}
                                delta={showGridMeters}
                            /> : null}
                        </LayerGroup>
                    </LayersControl.BaseLayer>
                ))
            }
        </LayersControl>
    )
}

export const DeviceMap = ({ onClick, onMouseMove, onMouseOut, experimentDataMaps, children, layerChosen, setLayerChosen, showGrid, showGridMeters }) => {
    const mapElement = React.useRef(null);

    const [layerPositions, setLayerPositions] = React.useState({});

    const getLayerPosition = (layerName) => {
        if (!layerName || layerName === '') return posbounds;

        const layerPos = (layerPositions || {})[layerName];
        if (layerPos) {
            return layerPos;
        }

        if (layerName === 'OSMMap') {
            return posbounds;
        }

        const row = (experimentDataMaps || []).find(r => r.imageName === layerName);
        if (row) {
            return [[row.upper, row.left], [row.lower, row.right]];
        }

        return posbounds;
    };

    const changeLayerPosition = () => {
        const newPositions = Object.assign({}, layerPositions);
        newPositions[layerChosen] = bounds2arr(mapElement.current.leafletElement.getBounds());
        setLayerPositions(newPositions);
    }

    React.useEffect(() => {
        if (!layerChosen) {
            setLayerChosen('OSMMap');
        }
    }, []);

    const showMap = layerChosen === 'OSMMap' ? true : (experimentDataMaps || []).find(r => r.imageName === layerChosen).embedded;

    if (mapElement && mapElement.current && mapElement.current.leafletElement) {
        mapElement.current.leafletElement.options.crs = showMap ? CRS.EPSG3857 : CRS.Simple;
        mapElement.current.leafletElement.invalidateSize();
    }

    return (
        <LeafletMap
            bounds={getLayerPosition(layerChosen)}
            zoom={15}
            ref={mapElement}
            style={{ height: "100%" }}
            // style={{ height: "100%", width: '100%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
            onClick={onClick}
            onMouseMove={onMouseMove}
            onMouseOut={onMouseOut}
            onBaseLayerChange={(e) => setLayerChosen(e.name)}
            onMoveEnd={changeLayerPosition}
            crs={showMap ? CRS.EPSG3857 : CRS.Simple}
            // crs={ CRS.Simple}
            minZoom={-10}
        >
            <DeviceMapLayers
                embedded={(experimentDataMaps || []).filter(row => row.embedded)}
                standalone={(experimentDataMaps || []).filter(row => !row.embedded)}
                showGrid={showGrid}
                showGridMeters={showGridMeters}
            />
            {children}
        </LeafletMap>
    );
}