import React from 'react';
import { CircleMarker } from 'react-leaflet';

export const ChosenMarker = ({ center }) => (
  <CircleMarker
    key="chosen"
    center={center}
    radius={9}
    color={'red'}
    opacity={1}
    dashArray={'4 4'}
    weight={2}
  />
);
