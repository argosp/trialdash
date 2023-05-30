import React from "react";
import { useMap } from 'react-leaflet/hooks'

export const MapResizeByBox = ({ box, needResize, setNeedResize }) => {
  const mapObj = useMap();

  const bounds = box.lower ? [[box.lower, box.left], [box.upper, box.right]] : box;

  React.useEffect(() => {
    mapObj.fitBounds(bounds);
  }, [bounds]);

  React.useEffect(() => {
    if (needResize) {
      mapObj.fitBounds(bounds);
      setNeedResize(false);
    }
  }, [needResize]);

  return null;
}
