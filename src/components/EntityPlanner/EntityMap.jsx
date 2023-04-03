import React, { useEffect } from 'react';
import {
    MapContainer,
    ZoomControl,
    useMapEvents,
} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { CRS, DomEvent, LatLngBounds } from 'leaflet';
import { EntityMapLayers } from './EntityMapLayers.jsx';

const position = [32.081128, 34.779729];
const posbounds = [[position[0] + 0.02, position[1] - 0.02], [position[0] - 0.02, position[1] + 0.02]];

const bounds2arr = (bounds) => {
    return [[bounds.getNorth(), bounds.getWest()], [bounds.getSouth(), bounds.getEast()]];
}

const MapEventer = ({ onClick, onBoxZoomEnd }) => {
    const mapObj = useMapEvents({
        click: (e) => {
            if (e.originalEvent.srcElement === mapObj._container) {
                onClick(e);
            }
        },
        boxzoomend: (e) => {
            DomEvent.stop(e);
            onBoxZoomEnd(e);
        }
    });
    return null;
};

export const EntityMap = ({ onClick, experimentDataMaps, children, layerChosen, setLayerChosen, onAreaMarked }) => {
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
    // console.log(currLayerBounds instanceof Array ? JSON.stringify(currLayerBounds) : currLayerBounds);

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

    useEffect(() => {
        if (leafletElement && leafletElement.boxZoom) {
            leafletElement.boxZoom._onMouseUp = function (e) {
                if (e.which === 1 || e.button === 1) {
                    this._finish();
                    if (this._moved) {
                        this._clearDeferredResetState();
                        this._resetStateTimeout = setTimeout(this._resetState.bind(this), 0);
                        // var bounds = new LatLngBounds(
                        //     this._map.containerPointToLatLng(this._startPoint),
                        //     this._map.containerPointToLatLng(this._point)
                        // );
                        this._map.fire('boxzoomend');//, { bounds });
                    }
                }
            };
        }
    }, [leafletElement]);

    return (
        <MapContainer
            bounds={currLayerBounds}
            zoom={15}
            ref={mapElement}
            style={{ height: "100%" }}
            // style={{ height: "100%", width: '100%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
            onBaseLayerChange={(e) => setLayerChosen(e.name)}
            onMoveEnd={changeLayerPosition}
            crs={showMap ? CRS.EPSG3857 : CRS.Simple}
            zoomControl={false}
        // oncontextmenu={console.log}
        >
            <MapEventer
                onClick={onClick}
                onBoxZoomEnd={onAreaMarked}
            />
            <EntityMapLayers
                embedded={(experimentDataMaps || []).filter(row => row.embedded)}
                standalone={(experimentDataMaps || []).filter(row => !row.embedded)}
                layerChosen={layerChosen}
            />
            <ZoomControl position='topright' />
            {children}
        </MapContainer>
    );
}