import React from 'react';
import {
    Map as LeafletMap,
    LayersControl,
    ImageOverlay,
    LayerGroup,
    ZoomControl,
} from "react-leaflet";
import {
    Paper
} from '@material-ui/core';
import config from '../../config';
import { CRS } from 'leaflet';
import { GridlinesLayer } from './GridlinesLayer.jsx';
import Control from './lib/react-leaflet-control.jsx'
import { SimplifiedSwitch } from './SimplifiedSwitch.jsx';
import { NumberTextField } from '../ExperimentContext/ExperimentForm/NumberTextField.jsx';
import 'leaflet/dist/leaflet.css';
import { MapTileLayer } from '../Maps/MapTileLayer.jsx';

const position = [32.081128, 34.779729];
const posbounds = [[position[0] + 0.02, position[1] - 0.02], [position[0] - 0.02, position[1] + 0.02]];

const bounds2arr = (bounds) => {
    return [[bounds.getNorth(), bounds.getWest()], [bounds.getSouth(), bounds.getEast()]];
}

const EmbeddedImageLayer = ({ image }) => (
    <ImageOverlay
        url={config.url + '/' + image.imageUrl}
        bounds={[[image.upper, image.left], [image.lower, image.right]]}
    />
)

const RealMapWithImagesLayer = ({ images }) => (
    <>
        <MapTileLayer key={'real'} />
        {
            images.map((row, i) => (
                <EmbeddedImageLayer image={row} key={'l' + i} />
            ))
        }
    </>
)

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

export const EntityMap = ({ onClick, onMouseMove, onMouseOut, experimentDataMaps, children, layerChosen, setLayerChosen }) => {
    const mapElement = React.useRef(null);

    const [layerPositions, setLayerPositions] = React.useState({});
    const [showGrid, setShowGrid] = React.useState(false);
    const [showGridMeters, setShowGridMeters] = React.useState(1);

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
    }

    if (mapElement && mapElement.current && mapElement.current.leafletElement) {
        // console.log('before invalidateSize');
        mapElement.current.leafletElement.invalidateSize();
        // console.log('after invalidateSize');
    }

    // console.log(experimentDataMaps, showMap);
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
            zoomControl={false}
        >
            <EntityMapLayers
                embedded={(experimentDataMaps || []).filter(row => row.embedded)}
                standalone={(experimentDataMaps || []).filter(row => !row.embedded)}
                showGrid={showGrid}
                showGridMeters={showGridMeters}
                layerChosen={layerChosen}
            />
            <ZoomControl position='topright'/>
            {layerChosen === 'OSMMap' ? null :
                <Control position="topright" >
                    <Paper>
                        <SimplifiedSwitch
                            label='Show grid'
                            value={showGrid}
                            setValue={v => setShowGrid(v)}
                        />
                        <br/>
                        <NumberTextField
                            label='Grid Meters'
                            value={showGridMeters}
                            onChange={v => setShowGridMeters(v)}
                        />
                    </Paper>
                </Control>
            }
            {children}
        </LeafletMap>
    );
}