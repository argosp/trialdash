import React from 'react';
import {
    Paper,
    Button,
    Grid
} from '@material-ui/core';
import {
    LayersControl,
    ImageOverlay,
    LayerGroup
} from "react-leaflet";
import { GridlinesLayer } from '../Maps/GridlinesLayer.jsx';
import Control from '../Maps/lib/react-leaflet-custom-control.jsx';
import { NumberTextField } from '../ExperimentContext/ExperimentForm/NumberTextField.jsx';
import { MapTileLayer } from '../Maps/MapTileLayer.jsx';
import config from '../../config';

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

const StandaloneImageLayer = ({ row, showGrid }) => {
    return (
        <>
            <EmbeddedImageLayer image={row} />
            {!showGrid.show ? null :
                <GridlinesLayer
                    from={[row.lower, row.left]}
                    to={[row.upper, row.right]}
                    delta={showGrid.meters}
                />
            }
        </>
    )
}

export const EntityMapLayers = ({ embedded, standalone, layerChosen, showGrid }) => {

    if (!standalone.length) {
        return <RealMapWithImagesLayer images={embedded} />
    }
    return (
        <>
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
                                <StandaloneImageLayer
                                    row={row}
                                    showGrid={showGrid}
                                />
                            </LayerGroup>
                        </LayersControl.BaseLayer>
                    ))
                }
            </LayersControl>
        </>
    )
}
