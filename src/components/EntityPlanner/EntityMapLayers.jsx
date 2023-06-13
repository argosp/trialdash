import React from 'react';
import {
    LayersControl,
    ImageOverlay,
    LayerGroup
} from "react-leaflet";
import { GridlinesLayer } from '../Maps/GridlinesLayer.jsx';
import { MapTileLayer } from '../Maps/MapTileLayer.jsx';
import config from '../../config';

const EmbeddedImageLayer = ({ image, showGrid }) => {
    return (
        <>
            <ImageOverlay
                url={config.url + '/' + image.imageUrl}
                bounds={[[image.upper, image.left], [image.lower, image.right]]}
                key={'imageoverlay'}
            />
            {(showGrid && showGrid.show)
                ? <GridlinesLayer
                    from={[image.lower, image.left]}
                    to={[image.upper, image.right]}
                    delta={showGrid.meters}
                    key={'grid'}
                />
                : null
            }
        </>
    )
}

const EntityLayer = ({ isEmbedded, embedded, showGrid }) => {
    return (
        <>
            {
                isEmbedded
                    ? <MapTileLayer key={'tilelayer'} />
                    : null
            }
            {
                embedded.map((row, i) => (
                    <EmbeddedImageLayer
                        image={row}
                        key={i}
                        showGrid={showGrid}
                    />
                ))
            }
        </>
    )
}

export const EntityMapLayers = ({ embedded, standalone, layerChosen, showGrid }) => {
    const hasMultiple = standalone.length > 0; // || embedded.length > 0;
    if (!hasMultiple) {
        return (
            <EntityLayer isEmbedded={true} showGrid={false} embedded={embedded} />
        )
    } else {
        return (
            <LayersControl position="topright" collapsed={false}>
                <LayersControl.BaseLayer key="OSMMap" name="OSMMap" checked={true}>
                    <LayerGroup>
                        <EntityLayer isEmbedded={true} showGrid={false} embedded={embedded} />
                    </LayerGroup>
                </LayersControl.BaseLayer>
                {
                    standalone.map((row, i) => (
                        <LayersControl.BaseLayer key={row.imageName} name={row.imageName} checked={false}>
                            <LayerGroup>
                                <EntityLayer isEmbedded={false} showGrid={showGrid} embedded={[row]} />
                            </LayerGroup>
                        </LayersControl.BaseLayer>
                    ))
                }
            </LayersControl>
        )
    }
}
