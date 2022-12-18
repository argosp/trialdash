import React from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import { styled } from '@material-ui/core/styles';

const NudeTooltip = styled(Tooltip)({
  background: 0,
  border: 0,
  borderRadius: 0,
  boxShadow: 'none',
  padding: 0,
  '&.leaflet-tooltip-top:before': {
    border: 0,
  },
  '&.leaflet-tooltip-bottom:before': {
    border: 0,
  },
  '&.leaflet-tooltip-left:before': {
    border: 0,
  },
  '&.leaflet-tooltip-right:before': {
    border: 0,
  },
});

const createRangeArray = (from, to, delta) => {
  let ret = [];
  if (Math.abs(delta) > 0.1) {
    const back = [];
    for (let pos = Math.min(-delta, to); pos > from; pos -= delta) {
      const show = (back.length + 1) % 5 === 0;
      const thick = show ? 1.2 : 0.5;
      back.push({ pos, thick, show });
    }
    back.push({ pos: from, thick: 2, show: false });
    back.reverse();

    const zero = from < 0 && to > 0 ? [{ pos: 0, thick: 2, show: false }] : [];

    const forw = [];
    for (let pos = Math.max(delta, from); pos < to; pos += delta) {
      const show = (forw.length + 1) % 5 === 0;
      const thick = show ? 1.2 : 0.5;
      forw.push({ pos, thick, show });
    }
    forw.push({ pos: to, thick: 2.5, show: false });

    ret = back.concat(zero).concat(forw);
  }
  return ret;
};

export const GridlinesLayer = ({ from, to, delta = 1 }) => {
  const lat0 = Math.min(from[0], to[0]);
  const lat1 = Math.max(from[0], to[0]);
  const lng0 = Math.min(from[1], to[1]);
  const lng1 = Math.max(from[1], to[1]);
  const lats = createRangeArray(lat0, lat1, delta);
  const lngs = createRangeArray(lng0, lng1, delta);
  return (
    <>
      {lats.map(({ pos: lat, thick, show }) => {
        return (
          <Polyline
            weight={thick}
            positions={[
              [lat, lng0],
              [lat, lng1],
            ]}>
            {!show ? null : (
              <NudeTooltip permanent direction={'bottom'} offset={[0, -(lng1 + lng0) / 2]}>
                {lat}
              </NudeTooltip>
            )}
          </Polyline>
        );
      })}
      {lngs.map(({ pos: lng, thick, show }) => {
        return (
          <Polyline
            weight={thick}
            positions={[
              [lat0, lng],
              [lat1, lng],
            ]}>
            {!show ? null : (
              <NudeTooltip permanent direction={'bottom'} offset={[-(lat1 + lat0) / 2, 0]}>
                {lng}
              </NudeTooltip>
            )}
          </Polyline>
        );
      })}
    </>
  );
};