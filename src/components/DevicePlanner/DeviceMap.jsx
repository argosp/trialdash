import React, { useState } from 'react';
import { Map as LeafletMap } from "react-leaflet";
import { TileLayer, LayersControl, ImageOverlay } from "react-leaflet";
import config from '../../config';

const position = [32.081128, 34.779729];

export const DeviceMap = ({ onClick, onMouseMove, onMouseOut, experimentDataMaps, children }) => {
    console.log(experimentDataMaps)
    const mapElement = React.useRef(null);
    const mapAttrib = process.env.REACT_APP_MAP_ATTRIBUTION || '&copy; <a href="https://carto.com">Carto</a> contributors';
    const mapTileUrl = process.env.REACT_APP_MAP_URL || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';
    if (!process.env.REACT_APP_MAP_ATTRIBUTION || !process.env.REACT_APP_MAP_URL) {
        console.log('Getting map tileserver url from hardcoded:', mapTileUrl);
    }

    const [mutedImages, setMutedImages] = useState({});

    const setOverlay = (name, toOn) => {
        const newMutedImages = Object.assign({}, mutedImages)
        newMutedImages[name] = !toOn;
        setMutedImages(newMutedImages);
    }

    React.useEffect(() => {
        mapElement.current.leafletElement.invalidateSize();
        mapElement.current.leafletElement.on('overlayadd', (e) => setOverlay(e.name, true));
        mapElement.current.leafletElement.on('overlayremove', (e) => setOverlay(e.name, false));
    }, []);

    let showMap = experimentDataMaps.length === 0 || experimentDataMaps.some(row => row.embedded);

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

            {
                !showMap ? null :
                    <TileLayer
                        attribution={mapAttrib}
                        url={mapTileUrl}
                    />
            }
            <LayersControl position="topright">
                {
                    experimentDataMaps.map(row => {
                        return (
                            <LayersControl.Overlay name={row.imageName} checked={!mutedImages[row.imageName]}>
                                <ImageOverlay
                                    url={config.url + '/' + row.imageUrl}
                                    bounds={[[row.upper, row.left], [row.lower, row.right]]}
                                />
                            </LayersControl.Overlay>
                        )
                    })
                }
            </LayersControl>

            {children}
        </LeafletMap>
    );
}