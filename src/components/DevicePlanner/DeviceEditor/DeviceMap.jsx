import React from 'react';
import { Map as LeafletMap } from "react-leaflet";
import { TileLayer, LayersControl, ImageOverlay } from "react-leaflet";

const position = [32.081128, 34.779729];

export const DeviceMap = ({ onClick, onMouseMove, onMouseOut, children }) => {
    const mapElement = React.useRef(null);

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
                <LayersControl.BaseLayer name="Carto" checked={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com">Carto</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="OpenStreetMap">
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Image">
                    <ImageOverlay
                        url="https://cdn.vox-cdn.com/thumbor/HKALidP1Nm7vvd6GrsLmUCSVlEw=/0x0:2048x2732/1200x800/filters:focal(540x2092:866x2418)/cdn.vox-cdn.com/uploads/chorus_image/image/52202887/super_mario_run_ipad_screenshot_01_2048.0.jpeg"
                        bounds={[[31.8, 34.2], [32.3, 35.2]]}
                    />
                </LayersControl.BaseLayer>
            </LayersControl>

            {children}
        </LeafletMap>
    );
}