import React from 'react';
import config from '../../../config';
import { ImageOverlay, LayerGroup, LayersControl } from 'react-leaflet';
import { GridlinesLayer } from './GridlinesLayer.jsx';
import { RealMapLayer } from './RealMapLayer.jsx';

const EmbeddedImageLayer = ({ image }) => (
  <ImageOverlay
    url={config.url + '/' + image.imageUrl}
    bounds={[
      [image.upper, image.left],
      [image.lower, image.right],
    ]}
  />
);

const RealMapWithImagesLayer = ({ images }) => (
  <>
    <RealMapLayer key={'real'} />
    {images.map((row, i) => (
      <EmbeddedImageLayer image={row} key={'l' + i} />
    ))}
  </>
);

export const EntityMapLayers = ({
  embedded,
  standalone,
  showGrid,
  showGridMeters,
  layerChosen,
}) => {
  if (!standalone.length) {
    return <RealMapWithImagesLayer images={embedded} />;
  }
  return (
    <LayersControl position="topright" collapsed={false}>
      <LayersControl.BaseLayer name="OSMMap" checked={true}>
        <LayerGroup>
          <RealMapWithImagesLayer images={embedded} />
        </LayerGroup>
      </LayersControl.BaseLayer>
      {standalone.map((row, i) => (
        <LayersControl.BaseLayer key={row.imageName} name={row.imageName}>
          <LayerGroup>
            <EmbeddedImageLayer image={row} />
            {showGrid && layerChosen === row.imageName ? (
              <GridlinesLayer
                from={[row.lower, row.left]}
                to={[row.upper, row.right]}
                delta={showGridMeters}
              />
            ) : null}
          </LayerGroup>
        </LayersControl.BaseLayer>
      ))}
    </LayersControl>
  );
};
