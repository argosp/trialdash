import React from 'react';
import { Map as LeafletMap } from 'react-leaflet';
import { CRS } from 'leaflet';
import { EntityMapLayers } from './MapLayers/EntityMapLayers.jsx';

const position = [32.081128, 34.779729];
const posbounds = [
  [position[0] + 0.02, position[1] - 0.02],
  [position[0] - 0.02, position[1] + 0.02],
];

const bounds2arr = (bounds) => {
  return [
    [bounds.getNorth(), bounds.getWest()],
    [bounds.getSouth(), bounds.getEast()],
  ];
};

export const EntityMap = ({
  onClick,
  onMouseMove,
  onMouseOut,
  experimentDataMaps,
  children,
  layerChosen,
  setLayerChosen,
  showGrid,
  showGridMeters,
  onContextMenu,
}) => {
  const mapElement = React.useRef(null);

  const [layerPositions, setLayerPositions] = React.useState({});

  const getLayerPosition = (layerName) => {
    if (!layerName || layerName === '') return posbounds;

    const layerPos = (layerPositions || {})[layerName];
    if (layerPos) {
      return layerPos;
    }

    if (layerName === 'OSMMap') {
      return posbounds;
    }

    const row = (experimentDataMaps || []).find((r) => r.imageName === layerName);
    if (row) {
      return [
        [row.upper, row.left],
        [row.lower, row.right],
      ];
    }

    return posbounds;
  };

  const changeLayerPosition = () => {
    const newPositions = Object.assign({}, layerPositions);
    newPositions[layerChosen] = bounds2arr(mapElement.current.leafletElement.getBounds());
    setLayerPositions(newPositions);
  };

  React.useEffect(() => {
    if (!layerChosen) {
      setLayerChosen('OSMMap');
    }
  }, []);

  const showMap =
    layerChosen === 'OSMMap'
      ? true
      : (experimentDataMaps || []).find((r) => r.imageName === layerChosen).embedded;

  if (mapElement && mapElement.current && mapElement.current.leafletElement) {
    mapElement.current.leafletElement.options.crs = showMap ? CRS.EPSG3857 : CRS.Simple;
    mapElement.current.leafletElement.invalidateSize();
  }

  return (
    <LeafletMap
      bounds={getLayerPosition(layerChosen)}
      zoom={15}
      ref={mapElement}
      style={{ height: '100%' }}
      // style={{ height: "100%", width: '100%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onBaseLayerChange={(e) => setLayerChosen(e.name)}
      onMoveEnd={changeLayerPosition}
      crs={showMap ? CRS.EPSG3857 : CRS.Simple}
      // crs={ CRS.Simple}
      minZoom={-10}>
      <EntityMapLayers
        embedded={(experimentDataMaps || []).filter((row) => row.embedded)}
        standalone={(experimentDataMaps || []).filter((row) => !row.embedded)}
        showGrid={showGrid}
        showGridMeters={showGridMeters}
        layerChosen={layerChosen}
      />
      {children}
    </LeafletMap>
  );
};
