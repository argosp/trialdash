import React from "react";
import { useMap } from 'react-leaflet/hooks'

export const MapResizeByBox = ({ box }) => {
  const mapObj = useMap();

  React.useEffect(() => {
    mapObj.fitBounds([[box.lower, box.left], [box.upper, box.right]]);
  }, [box]);

  return null;
}
