import React from 'react';
import { Map as LeafletMap } from "react-leaflet";
import { TileLayer, LayersControl, ImageOverlay } from "react-leaflet";

const position = [32.081128, 34.779729];

export const DeviceMap = ({ onClick, onMouseMove, onMouseOut, children }) => {
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

            <LayersControl position="topright">
                <LayersControl.BaseLayer name="Map" checked={true}>
                    <TileLayer
                        attribution={mapAttrib}
                        url={mapTileUrl}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.Overlay name="Image">
                    <ImageOverlay
                        url="https://cdn.vox-cdn.com/thumbor/HKALidP1Nm7vvd6GrsLmUCSVlEw=/0x0:2048x2732/1200x800/filters:focal(540x2092:866x2418)/cdn.vox-cdn.com/uploads/chorus_image/image/52202887/super_mario_run_ipad_screenshot_01_2048.0.jpeg"
                        bounds={[[32.08083,34.77524], [32.08962,34.78876]]}
                    />
                </LayersControl.Overlay>
            </LayersControl>

            {children}
        </LeafletMap>
    );
}