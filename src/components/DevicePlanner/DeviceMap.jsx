import React from 'react';
import { Map as LeafletMap } from "react-leaflet";
import { TileLayer, LayersControl, ImageOverlay } from "react-leaflet";

const position = [32.081128, 34.779729];

export const DeviceMap = ({ onClick, onMouseMove, onMouseOut, experimentDataMaps, children }) => {
    console.log(experimentDataMaps)
    const mapElement = React.useRef(null);
    const mapAttrib = process.env.REACT_APP_MAP_ATTRIBUTION || '&copy; <a href="https://carto.com">Carto</a> contributors';
    const mapTileUrl = process.env.REACT_APP_MAP_URL || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';
    if (!process.env.REACT_APP_MAP_ATTRIBUTION || !process.env.REACT_APP_MAP_URL) {
        console.log('Getting map tileserver url from hardcoded:', mapTileUrl);
    }

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

            {/* <LayersControl position="topright">
                <LayersControl.BaseLayer name="Map" checked={true}> */}
            <TileLayer
                attribution={mapAttrib}
                url={mapTileUrl}
            />
            {/* </LayersControl.BaseLayer>
                <LayersControl.Overlay name="Image"> */}
            {
                experimentDataMaps.map(row => {
                    return (
                        <ImageOverlay
                            url={row.imageUrl}
                            bounds={[[row.upper, row.left], [row.lower, row.right]]}
                        />)
                })
            }
            {/* </LayersControl.Overlay>
            </LayersControl> */}

            {children}
        </LeafletMap>
    );
}