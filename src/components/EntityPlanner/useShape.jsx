import React, { useState } from 'react';
import { lerpPoint, rectByAngle, resamplePolyline, splineCurve } from './GeometryUtils.js';

export const useShape = (rectAngle, rectRows) => {
    const [shape, setShape] = useState('Point');

    const shapeOptions = [
        {
            name: 'Free',
            toLine: () => [],
            toPositions: (points, amount) => (amount && points.length ? [points[0]] : []),
        },
        {
            name: 'Point',
            toLine: () => [],
            toPositions: (points, amount) => (amount && points.length ? [points[0]] : []),
        },
        {
            name: 'Poly',
            toLine: (points) => [points],
            toPositions: (points, amount) => resamplePolyline(points, amount),
        },
        {
            name: 'Curve',
            toLine: (points) => [splineCurve(points, 100)],
            toPositions: (points, amount) => resamplePolyline(splineCurve(points, 100), amount),
        },
        {
            name: 'Rect',
            toLine: (points, angle = rectAngle) => {
                const [nw, ne, se, sw] = rectByAngle(points, angle);
                return [[nw, ne, se, sw, nw]];
            },
            toPositions: (points, amount, rows = rectRows, angle = rectAngle) => {
                if (points.length === 0) return [];
                const [nw, ne, se, sw] = rectByAngle(points, angle);
                let ret = [];
                const cols = Math.ceil(amount / rows);
                if (rows > 1 && cols > 1) {
                    for (let y = 0; y < rows; ++y) {
                        const west = lerpPoint(nw, sw, y / (rows - 1));
                        const east = lerpPoint(ne, se, y / (rows - 1));
                        for (let x = 0; x < cols; ++x) {
                            ret.push(lerpPoint(west, east, x / (cols - 1)));
                        }
                    }
                }
                return ret;
            },
        },
        {
            name: 'None',
            toLine: () => [],
            toPositions: () => []
        }
    ];

    const shapeData = shapeOptions.find((s) => s.name === shape) || shapeOptions.at(-1);
    const { toLine: shapeToLine, toPositions: shapeToPositions } = shapeData;

    return { shape, setShape, shapeToLine, shapeToPositions };
}
