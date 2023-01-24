import React from "react";
import { Map as LeafletMap } from "react-leaflet";
import {
  ImageOverlay,
} from "react-leaflet";
import config from "../../../config";
import { CRS } from 'leaflet';
import { MapTileLayer } from "../../Maps/MapTileLayer.jsx";

const defaultPosition = [32.0852, 34.782];

const boundsToMiddle = (imageBounds) => {
  if (!imageBounds) return defaultPosition;
  const [[upper, left], [lower, right]] = imageBounds;
  const middlePosition = [(lower + upper) / 2, (left + right) / 2];
  return middlePosition;
}

export const MapWithImage = React.forwardRef(({ showMap, imageUrl, imageBounds, children }, mapRef) => {
  const position = boundsToMiddle(imageBounds);

  return (
    <LeafletMap
      center={position}
      zoom={15}
      style={{ height: "400px", width: '100%' }}
      ref={mapRef}
      crs={showMap ? CRS.EPSG3857 : CRS.Simple}
      minZoom={-10}
    >
      {
        !showMap ? null :
          <MapTileLayer />
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