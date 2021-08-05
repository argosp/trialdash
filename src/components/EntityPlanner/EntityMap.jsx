import React, { useState } from 'react';
import {
    Map as LeafletMap,
    TileLayer,
    LayersControl,
    ImageOverlay,
    LayerGroup,
    Polyline,
    Tooltip
} from "react-leaflet";
import config from '../../config';
import { L, latLngBounds } from 'leaflet';
import { CRS } from 'leaflet';
// import styled from "styled-components";
import { withStyles } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

const NudeTooltip = styled(Tooltip)({
    background: 0,
    border: 0,
    borderRadius: 0,
    boxShadow: 'none',
    padding: 0,
    '&.leaflet-tooltip-top:before': {
        border: 0
    },
    '&.leaflet-tooltip-bottom:before': {
        border: 0
    },
    '&.leaflet-tooltip-left:before': {
        border: 0
    },
    '&.leaflet-tooltip-right:before': {
        border: 0
    }
});

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
    let ret = [];
    if (Math.abs(delta) > 0.1) {
        const back = []
        for (let pos = Math.min(-delta, to); pos > from; pos -= delta) {
            const show = (back.length + 1) % 5 === 0;
            const thick = show ? 1.2 : 0.5;
            back.push({ pos, thick, show });
        }
        back.push({ pos: from, thick: 2, show: false });
        back.reverse();

        const zero = (from < 0 && to > 0) ? [{ pos: 0, thick: 2, show: false }] : [];

        const forw = []
        for (let pos = Math.max(delta, from); pos < to; pos += delta) {
            const show = (forw.length + 1) % 5 === 0;
            const thick = show ? 1.2 : 0.5;
            forw.push({ pos, thick, show });
        }
        forw.push({ pos: to, thick: 2.5, show: false });

        ret = back.concat(zero).concat(forw);
    }
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
        {lats.map(({ pos: lat, thick, show }) => {
            return (
                <Polyline
                    weight={thick}
                    positions={[
                        [lat, lng0],
                        [lat, lng1],
                    ]}
                >
                    {!show ? null :
                        <NudeTooltip permanent direction={'bottom'} offset={[0, -(lng1 + lng0) / 2]}>
                            {lat}
                        </NudeTooltip>
                    }
                </Polyline>
            )
        })}
        {lngs.map(({ pos: lng, thick, show }) => {
            return (
                <Polyline
                    weight={thick}
                    positions={[
                        [lat0, lng],
                        [lat1, lng],
                    ]}
                >
                    {!show ? null :
                        <NudeTooltip permanent direction={'bottom'} offset={[-(lat1 + lat0) / 2, 0]}>
                            {lng}
                        </NudeTooltip>
                    }
                </Polyline>
            )
        })}
    </>)
}

const EntityMapLayers = ({ embedded, standalone, showGrid, showGridMeters, layerChosen }) => {
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
                            {(showGrid && layerChosen === row.imageName) ? <GridlinesLayer
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

export const EntityMap = ({ onClick, onMouseMove, onMouseOut, experimentDataMaps, children, layerChosen, setLayerChosen, showGrid, showGridMeters }) => {
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
            <EntityMapLayers
                embedded={(experimentDataMaps || []).filter(row => row.embedded)}
                standalone={(experimentDataMaps || []).filter(row => !row.embedded)}
                showGrid={showGrid}
                showGridMeters={showGridMeters}
                layerChosen={layerChosen}
            />
            {children}
        </LeafletMap>
    );
}