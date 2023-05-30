import React from "react";
import { useMap } from 'react-leaflet/hooks'

export const MapResizeByBox = ({ box, needResize, setNeedResize }) => {
  const mapObj = useMap();

  React.useEffect(() => {
    mapObj.fitBounds([[box.lower, box.left], [box.upper, box.right]]);
  }, [box]);

  React.useEffect(() => {
    if (needResize) {
      mapObj.fitBounds([[box.lower, box.left], [box.upper, box.right]]);
      setNeedResize(false);
    }
  }, [needResize]);

  return null;
}
