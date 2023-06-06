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

const EmbeddedImageLayer = ({ image }) => {
    // console.log(image)
    return (
        <ImageOverlay
            url={config.url + '/' + image.imageUrl}
            bounds={[[image.upper, image.left], [image.lower, image.right]]}
        />
    )
}

const EntityLayer = ({ isEmbedded, embedded, showGrid }) => {
    return (
        <>
            {
                isEmbedded
                    ? <MapTileLayer key={'real'} />
                    : null
            }
            {
                embedded.map((row, i) => (
                    <>
                        <EmbeddedImageLayer image={row} key={'l' + i} />
                        {!showGrid.show
                            ? null
                            : <GridlinesLayer
                                from={[row.lower, row.left]}
                                to={[row.upper, row.right]}
                                delta={showGrid.meters}
                            />
                        }
                    </>
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
                    standalone.map(row => (
                        <LayersControl.BaseLayer key={row.imageName} name={row.imageName} checked={false}>
                            <LayerGroup>
                                <EntityLayer isEmbedded={false} showGrid={false} embedded={[row]} />
                            </LayerGroup>
                        </LayersControl.BaseLayer>
                    ))
                }
            </LayersControl>
        )
    }
}
