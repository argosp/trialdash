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
import { GridlinesLayer } from './GridlinesLayer.jsx';
import Control from './lib/react-leaflet-control.jsx';
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

export const EntityMapLayers = ({ embedded, standalone, layerChosen }) => {
    const [showGrid, setShowGrid] = React.useState(false);
    const [showGridMeters, setShowGridMeters] = React.useState(1);

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
                                <EmbeddedImageLayer image={row} />
                                {(showGrid && layerChosen === row.imageName)
                                    ? <GridlinesLayer
                                        from={[row.lower, row.left]}
                                        to={[row.upper, row.right]}
                                        delta={showGridMeters}
                                    />
                                    : null
                                }
                            </LayerGroup>
                        </LayersControl.BaseLayer>
                    ))
                }
            </LayersControl>
            {layerChosen === 'OSMMap'
                ? null
                : <Control position="bottomleft" >
                    <Paper style={{ padding: '5px' }}>
                        <Grid container spacing='5px'>
                            <Grid item>
                                <Button
                                    variant={showGrid ? 'contained' : 'outlined'}
                                    color={'primary'}
                                    onClick={() => {
                                        setShowGrid(!showGrid);
                                    }}
                                >
                                    Grid
                                </Button>
                            </Grid>
                            <Grid item>
                                <NumberTextField
                                    width={'70px'}
                                    label='Meters'
                                    value={showGridMeters}
                                    onChange={v => setShowGridMeters(v)}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Control>
            }
        </>
    )
}
