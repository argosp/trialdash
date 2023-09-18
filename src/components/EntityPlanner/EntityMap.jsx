import React, { useEffect } from 'react';
import {
    MapContainer,
    ZoomControl,
    useMapEvents,
} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { CRS, DomEvent, LatLngBounds } from 'leaflet';
import 'leaflet-contextmenu';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';
import { EntityMapLayers } from './EntityMapLayers.jsx';
import { MapCoordinates } from '../Maps/MapCoordinates.jsx';

const position = [32.081128, 34.779729];
const posbounds = [[position[0] + 0.02, position[1] - 0.02], [position[0] - 0.02, position[1] + 0.02]];

const bounds2arr = (bounds) => {
    return [[bounds.getNorth(), bounds.getWest()], [bounds.getSouth(), bounds.getEast()]];
}

const MapEventer = ({ onClick, onBoxZoomEnd, onBaseLayerChange, onMoveEnd
}) => {
    const mapObj = useMapEvents({
        click: (e) => {
            // console.log(e.latlng)
            if (e.originalEvent.srcElement === mapObj._container) {
                onClick(e);
            }
        },
        // mousemove: (e) => {
        //     console.log(e.latlng)
        // },
        boxzoomend: (e) => {
            DomEvent.stop(e);
            onBoxZoomEnd(e);
        },
        baselayerchange: (e) => onBaseLayerChange(e, mapObj),
        moveend: (e) => onMoveEnd(e, mapObj)
    });

    if (mapObj.boxZoom) {
        mapObj.boxZoom._onMouseUp = function (e) {
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
    console.log(mapObj.getZoom())

    return null;
};

export const EntityMap = ({ onClick, experimentDataMaps, children, layerChosen, setLayerChosen, onAreaMarked, showGrid }) => {
    const [layerPositions, setLayerPositions] = React.useState({});

    // this to signify to moveEnd event that the map moved because layer has changed, not that the user moved the map manually
    let moveFromLayerChange = false;

    const handleBaseLayerChange = (e, mapObj) => {
        const newLayerName = e.name;
        setLayerChosen(newLayerName);
        const layerRow = (experimentDataMaps || []).find(r => r.imageName === newLayerName);
        const showMap = newLayerName === 'OSMMap' ? true : layerRow.embedded;
        const crs = showMap ? CRS.EPSG3857 : CRS.Simple;
        mapObj.options.crs = crs;
        let currLayerBounds = (layerPositions || {})[newLayerName];
        if (!currLayerBounds) {
            currLayerBounds = posbounds;
            if (layerRow && newLayerName !== 'OSMMap') {
                currLayerBounds = [[layerRow.upper, layerRow.left], [layerRow.lower, layerRow.right]];
            }
        }
        moveFromLayerChange = true;
        mapObj.fitBounds(currLayerBounds);
        moveFromLayerChange = false;
    }

    const handleMoveEnd = (e, mapObj) => {
        if (!moveFromLayerChange) {
            const bounds = bounds2arr(mapObj.getBounds());
            setLayerPositions({ ...layerPositions, [layerChosen]: bounds });
        }
    }

    useEffect(() => {
        if (!layerChosen) {
            setLayerChosen('OSMMap');
        }
    }, []);

    return (
        <MapContainer
            zoom={15}
            style={{ height: "100%" }}
            // style={{ height: "100%", width: '100%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
            crs={CRS.EPSG3857}
            bounds={posbounds}
            zoomControl={false}
            minZoom={-6}
            maxNativeZoom={18}
            maxZoom={24}
            contextmenu={true}
        >
            <MapEventer
                onClick={onClick}
                onBoxZoomEnd={onAreaMarked}
                onBaseLayerChange={handleBaseLayerChange}
                onMoveEnd={handleMoveEnd}
            />
            <EntityMapLayers
                embedded={(experimentDataMaps || []).filter(row => row.embedded)}
                standalone={(experimentDataMaps || []).filter(row => !row.embedded)}
                layerChosen={layerChosen}
                showGrid={showGrid}
            />
            <ZoomControl position='bottomright' />
            {children}
        </MapContainer>
    );
}