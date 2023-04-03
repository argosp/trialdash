import React, { useEffect } from 'react';
import {
    MapContainer,
    ZoomControl,
    useMapEvents,
} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { CRS, DomEvent, LatLngBounds } from 'leaflet';
import { EntityMapLayers } from './EntityMapLayers.jsx';
import Control from '../Maps/lib/react-leaflet-custom-control.jsx';

const position = [32.081128, 34.779729];
const posbounds = [[position[0] + 0.02, position[1] - 0.02], [position[0] - 0.02, position[1] + 0.02]];

const bounds2arr = (bounds) => {
    return [[bounds.getNorth(), bounds.getWest()], [bounds.getSouth(), bounds.getEast()]];
}

const MapEventer = ({ onClick, onBoxZoomEnd, onBaseLayerChange, onMoveEnd
}) => {
    const leafletElement = useMapEvents({
        click: (e) => {
            if (e.originalEvent.srcElement === leafletElement._container) {
                onClick(e);
            }
        },
        boxzoomend: (e) => {
            DomEvent.stop(e);
            onBoxZoomEnd(e);
        },
        baselayerchange: onBaseLayerChange,
        moveend: onMoveEnd
    });

    if (leafletElement.boxZoom) {
        leafletElement.boxZoom._onMouseUp = function (e) {
            if (e.which === 1 || e.button === 1) {
                this._finish();
                if (this._moved) {
                    this._clearDeferredResetState();
                    this._resetStateTimeout = setTimeout(this._resetState.bind(this), 0);
                    var boxZoomBounds = new LatLngBounds(
                        this._map.containerPointToLatLng(this._startPoint),
                        this._map.containerPointToLatLng(this._point)
                    );
                    this._map.fire('boxzoomend', { boxZoomBounds });
                }
            }
        };
    }

    return null;
};

export const EntityMap = ({ onClick, experimentDataMaps, children, layerChosen, setLayerChosen, onAreaMarked, showGrid }) => {
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

    const changeLayerPosition = () => {
        const newPositions = Object.assign({}, layerPositions);
        newPositions[layerChosen] = bounds2arr(mapElement.current.getBounds());
        setLayerPositions(newPositions);
    }

    useEffect(() => {
        if (!layerChosen) {
            setLayerChosen('OSMMap');
        }
    }, []);

    const showMap = layerChosen === 'OSMMap' ? true : (experimentDataMaps || []).find(r => r.imageName === layerChosen).embedded;

    return (
        <MapContainer
            bounds={currLayerBounds}
            zoom={15}
            ref={mapElement}
            style={{ height: "100%" }}
            // style={{ height: "100%", width: '100%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
            crs={showMap ? CRS.EPSG3857 : CRS.Simple}
            zoomControl={false}
        >
            <MapEventer
                onClick={onClick}
                onBoxZoomEnd={onAreaMarked}
                onBaseLayerChange={(e) => setLayerChosen(e.name)}
                onMoveEnd={changeLayerPosition}
            />
            <EntityMapLayers
                embedded={(experimentDataMaps || []).filter(row => row.embedded)}
                standalone={(experimentDataMaps || []).filter(row => !row.embedded)}
                layerChosen={layerChosen}
                showGrid={showGrid}
            />
            <ZoomControl position='topright' />
            {children}
        </MapContainer>
    );
}