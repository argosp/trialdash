import React, { useEffect } from 'react';
import {
    Map as LeafletMap,
    ZoomControl,
} from "react-leaflet";
import { CRS } from 'leaflet';
import * as L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { EntityMapLayers } from './EntityMapLayers.jsx';

const position = [32.081128, 34.779729];
const posbounds = [[position[0] + 0.02, position[1] - 0.02], [position[0] - 0.02, position[1] + 0.02]];

const bounds2arr = (bounds) => {
    return [[bounds.getNorth(), bounds.getWest()], [bounds.getSouth(), bounds.getEast()]];
}

export const EntityMap = ({ onClick, experimentDataMaps, children, layerChosen, setLayerChosen }) => {
    const mapElement = React.useRef(null);

    const [layerPositions, setLayerPositions] = React.useState({});

    const layerRow = (experimentDataMaps || []).find(r => r.imageName === layerChosen);
    let currLayerBounds = (layerPositions || {})[layerChosen];
    if (!currLayerBounds) {
        currLayerBounds = posbounds;
        if (layerRow && layerChosen !== 'OSMMap') {
            currLayerBounds = [[layerRow.upper, layerRow.left], [layerRow.lower, layerRow.right]];
        }
    }
    console.log(currLayerBounds instanceof Array ? JSON.stringify(currLayerBounds) : currLayerBounds);

    const changeLayerPosition = () => {
        const newPositions = Object.assign({}, layerPositions);
        newPositions[layerChosen] = bounds2arr(mapElement.current.leafletElement.getBounds());
        setLayerPositions(newPositions);
    }

    useEffect(() => {
        if (!layerChosen) {
            setLayerChosen('OSMMap');
        }
    }, []);

    const showMap = layerChosen === 'OSMMap' ? true : (experimentDataMaps || []).find(r => r.imageName === layerChosen).embedded;

    const leafletElement = mapElement && mapElement.current ? mapElement.current.leafletElement : undefined;
    if (leafletElement) {
        leafletElement.invalidateSize();
    }

    useEffect(() => {
        if (leafletElement && leafletElement.boxZoom) {
            leafletElement.boxZoom._onMouseUp = function (e) {
                if (e.which === 1 || e.button === 1) {
                    this._finish();
                    if (this._moved) {
                        this._clearDeferredResetState();
                        this._resetStateTimeout = setTimeout(this._resetState.bind(this), 0);
                        var bounds = new L.LatLngBounds(
                            this._map.containerPointToLatLng(this._startPoint),
                            this._map.containerPointToLatLng(this._point)
                        );
                        this._map.fire('boxzoomend', { boxZoomBounds: bounds })
                    }
                }
            };
        }
    }, [leafletElement]);

    return (
        <LeafletMap
            bounds={currLayerBounds}
            zoom={15}
            ref={mapElement}
            style={{ height: "100%" }}
            // style={{ height: "100%", width: '100%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
            onClick={onClick}
            onBaseLayerChange={(e) => setLayerChosen(e.name)}
            onMoveEnd={changeLayerPosition}
            crs={showMap ? CRS.EPSG3857 : CRS.Simple}
            zoomControl={false}
            onBoxZoomEnd={function (e) {
                console.log('hello', e, this);
            }}
        >
            <EntityMapLayers
                embedded={(experimentDataMaps || []).filter(row => row.embedded)}
                standalone={(experimentDataMaps || []).filter(row => !row.embedded)}
                layerChosen={layerChosen}
            />
            <ZoomControl position='topright' />
            {children}
        </LeafletMap>
    );
}