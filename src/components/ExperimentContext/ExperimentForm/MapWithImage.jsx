import React from "react";
import { Map as LeafletMap } from "react-leaflet";
import {
  TileLayer,
  ImageOverlay,
} from "react-leaflet";
import config from "../../../config";

export const MapWithImage = React.forwardRef(({ position, showMap, imageUrl, imageBounds, children }, mapRef) => {
  const mapAttrib = process.env.REACT_APP_MAP_ATTRIBUTION || '&copy; <a href="https://carto.com">Carto</a> contributors';
  const mapTileUrl = process.env.REACT_APP_MAP_URL || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';

  return (
    <LeafletMap
      center={position}
      zoom={15}
      style={{ height: "400px", width: '100%' }}
      ref={mapRef}
    >
      {
        !showMap ? null :
          <TileLayer
            key='map'
            attribution={mapAttrib}
            url={mapTileUrl}
          />
      }
      {
        !imageBounds ? null :
          <ImageOverlay
            key='image'
            url={config.url + '/' + imageUrl}
            bounds={imageBounds}
          />
      }
      {children}
    </LeafletMap>
  )
})