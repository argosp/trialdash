import { Button, InputLabel, List, Paper, Slider, Switch } from '@material-ui/core';
import React, { useRef, useEffect } from 'react';
import { Map as LeafletMap, Polyline, TileLayer, LayersControl, ImageOverlay } from "react-leaflet";
import { DeviceMarker } from './DeviceMarker';
import { DeviceRow } from './DeviceRow';
import { JsonStreamer } from './JsonStreamer';
import { ShapeChooser } from './ShapeChooser';
import { TypeChooser } from './TypeChooser';
import { arcCurveFromPoints, lerpPoint, resamplePolyline, splineCurve, polylineDistance, distToText } from './Utils';

const position = [32.081128, 34.779729];

let lastIndex;

export const DeviceEditor = ({ devices, setDevices }) => {
    const mapElement = useRef(null);
    const currPolyline = useRef(null);
    const auxPolyline = useRef(null);

    const [selectedType, setSelectedType] = React.useState(devices[0].type);
    const [selection, setSelection] = React.useState([]);
    const [showAll, setShowAll] = React.useState(false);
    const [shape, setShape] = React.useState("Point");
    const [markedPoints, setMarkedPoints] = React.useState([]);
    const [rectAngle, setRectAngle] = React.useState(0);
    const [rectRows, setRectRows] = React.useState(3);
    const [devicesShowName, setDevicesShowName] = React.useState(false);

    const changeLocations = (type, indices, newLocations) => {
        let tempDevices = JSON.parse(JSON.stringify(devices));
        let typeDevices = tempDevices.find(d => d.type === type).items;
        for (let i = 0; i < indices.length; ++i) {
            typeDevices[indices[i]].position = newLocations[Math.min(i, newLocations.length - 1)];
        }
        return tempDevices;
    };

    const handleSelectionClick = (index, doRange) => {
        let sel = [];
        if (!doRange) {
            if (selection.includes(index)) {
                sel = selection.filter(s => s !== index);
            } else {
                sel = selection.concat([index]);
            }
        } else if (lastIndex !== undefined) {
            const low = Math.min(index, lastIndex), high = Math.max(index, lastIndex);
            sel = selection.filter(s => s < low);
            for (let i = low; i <= high; ++i) {
                sel.push(i);
            }
            sel.concat(selection.filter(s => s > high));
        }
        setSelection(sel.sort());
        lastIndex = index;
    }

    const handleMapClick = e => {
        // if (selection.length < 1) return;
        const currPoint = [e.latlng.lat, e.latlng.lng];
        if (shape === 'Point') {
            setDevices(changeLocations(selectedType, selection, [currPoint]));
            setMarkedPoints([]);
            setSelection([]);
        } else {
            setMarkedPoints(markedPoints.concat([currPoint]));
        }
    };

    /** @returns Rectangle as an array of its 4 points */
    const rectByAngle = (points, angle) => {
        // return [p0, [p1[0], p0[1]], p1, [p0[0], p1[1]]];
        return points.concat([points[0], points[0], points[0], points[0]]).slice(0, 4);
    }

    const shapeOptions = [
        {
            name: 'Point',
            toLine: points => [],
            toPositions: points => [points[0]]
        },
        {
            name: 'Poly',
            toLine: points => [points],
            toPositions: points => resamplePolyline(points, selection.length)
        },
        {
            name: 'Curve',
            toLine: points => [splineCurve(points, 100)],
            toPositions: points => resamplePolyline(splineCurve(points, 100), selection.length)
        },
        {
            name: 'Arc',
            toLine: points => {
                if (points.length <= 2) return [points];
                const arc = arcCurveFromPoints(points, 400);
                return [[points[0], arc[0]], arc];
            },
            toPositions: points => resamplePolyline(arcCurveFromPoints(points, 400), selection.length)
        },
        {
            name: 'Rect',
            toLine: (points, angle = rectAngle) => {
                const [nw, ne, se, sw] = rectByAngle(points, angle);
                return [[nw, ne, se, sw, nw]];
            },
            toPositions: (points, rows = rectRows, angle = rectAngle) => {
                const [nw, ne, se, sw] = rectByAngle(points, angle);
                let ret = [];
                const cols = Math.ceil(selection.length / rows);
                for (let y = 0; y < rows; ++y) {
                    const west = lerpPoint(nw, sw, y / (rows - 1));
                    const east = lerpPoint(ne, se, y / (rows - 1));
                    for (let x = 0; x < cols; ++x) {
                        ret.push(lerpPoint(west, east, x / (cols - 1)));
                    }
                }
                return ret;
            }
        }
    ];

    const handlePutDevices = () => {
        const positions = shapeData().toPositions(markedPoints);
        setDevices(changeLocations(selectedType, selection, positions));
        setMarkedPoints([]);
        setSelection([]);
    };

    const shapeData = () => shapeOptions.find(s => s.name === shape);

    const setLatLngsWithDist = (leafletElement, points) => {
        leafletElement.setLatLngs(points);
        const dist = polylineDistance(leafletElement.getLatLngs());
        if (dist > 0) {
            leafletElement.bindTooltip(distToText(dist)).openTooltip();
        }
    };

    const renderShape = (hoverPoint) => {
        if (!markedPoints.length) return;
        const points = hoverPoint ? markedPoints.concat([hoverPoint]) : markedPoints;
        const shownPolylines = shapeData().toLine(points);
        setLatLngsWithDist(currPolyline.current.leafletElement, shownPolylines[0]);
        if (shape === 'Arc') {
            setLatLngsWithDist(auxPolyline.current.leafletElement, shownPolylines.length > 1 ? shownPolylines[1] : []);
        }
    };

    const handleMouseMove = e => {
        renderShape(e.latlng ? [e.latlng.lat, e.latlng.lng] : undefined);
    };

    const handleMouseOut = () => {
        renderShape();
    };

    useEffect(() => {
        renderShape();
    })

    return (
        <div className="App" style={{ position: 'relative', height: '100vh' }}>
            <LeafletMap center={position} zoom={15}
                ref={mapElement}
                style={{ width: '70%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
                onClick={handleMapClick}
                onMouseMove={handleMouseMove}
                onMouseOut={handleMouseOut}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer name="Carto" checked={true}>
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com">Carto</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Image">
                        <ImageOverlay
                            url="https://cdn.vox-cdn.com/thumbor/HKALidP1Nm7vvd6GrsLmUCSVlEw=/0x0:2048x2732/1200x800/filters:focal(540x2092:866x2418)/cdn.vox-cdn.com/uploads/chorus_image/image/52202887/super_mario_run_ipad_screenshot_01_2048.0.jpeg"
                            bounds={[[31.8, 34.2], [32.3, 35.2]]}
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>
                {
                    devices.map(devType => {
                        if (showAll || (devType.type === selectedType)) {
                            return devType.items.map((dev, index) => {
                                if (dev.position) {
                                    return <DeviceMarker key={dev.name} device={dev}
                                        isSelected={selection.includes(index)}
                                        isTypeSelected={devType.type === selectedType}
                                        shouldShowName={devicesShowName}
                                    />
                                } else {
                                    return null;
                                }
                            });
                        } else {
                            return null;
                        }
                    })
                }

                {
                    (!markedPoints || !markedPoints.length) ? null :
                        <>
                            <Polyline positions={[]} ref={currPolyline} />
                            {
                                shape !== 'Arc' ? null :
                                    <Polyline positions={[]} ref={auxPolyline} />
                            }
                        </>
                }

            </LeafletMap>
            <Paper
                style={{
                    position: 'absolute', height: '88%', overflow: 'auto', top: 0, width: '28%',
                    left: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}
            >
                <div
                    style={{ margin: 10 }}
                >
                    <ShapeChooser
                        shape={shape}
                        onChange={(val) => setShape(val)}
                        shapeOptions={shapeOptions}
                    />
                    {shape !== 'Rect' ? null :
                        <div style={{ display: 'block' }}>
                            {/* <div style={{ display: 'inline-block', margin: 5, width: '40%' }}>
                                <InputLabel id="rect-angle" style={{ fontSize: 10 }}>Rect angle</InputLabel>
                                <Slider
                                    onChange={(e, v) => setRectAngle(v)}
                                    value={rectAngle}
                                    defaultValue={0}
                                    id="rect-angle"
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={90}
                                />
                            </div> */}
                            <div style={{ display: 'inline-block', margin: 5, width: '40%' }}>
                                <InputLabel id="rect-rows" style={{ fontSize: 10 }}>Rect rows</InputLabel>
                                <Slider
                                    onChange={(e, v) => setRectRows(v)}
                                    value={rectRows}
                                    defaultValue={3}
                                    id="rect-rows"
                                    valueLabelDisplay="auto"
                                    min={2}
                                    max={20}
                                />
                            </div>
                        </div>
                    }
                    <Button variant="contained" color="primary"
                        disabled={shape === 'Point'}
                        style={{ margin: 5 }}
                        onClick={handlePutDevices}
                    >
                        Put devices
                    </Button>
                    <TypeChooser
                        selectedType={selectedType}
                        onChange={newType => {
                            setSelection([]);
                            setSelectedType(newType);
                        }}
                        showAll={showAll}
                        setShowAll={val => setShowAll(val)}
                        typeOptions={devices.map(dev => { return { name: dev.type } })}
                    />
                    <div style={{ display: 'inline-block', verticalAlign: 'text-top', margin: 5 }}>
                        <InputLabel id="show-all-types" style={{ fontSize: 10 }}>Devices show name</InputLabel>
                        <Switch id="show-all-types" color="primary" inputProps={{ 'aria-label': 'primary checkbox' }}
                            value={devicesShowName}
                            onChange={e => setDevicesShowName(e.target.checked)}
                        />
                    </div>

                    <div style={{ overflow: 'scroll', height: 'inherit', display: 'block' }}
                    // inputProps={{ style: { overflow: 'scroll' } }}
                    >
                        <List>
                            {
                                devices.filter(d => d.type === selectedType).map(devItems =>
                                    devItems.items.map((dev, index) =>
                                        <DeviceRow
                                            key={dev.name}
                                            dev={dev}
                                            isSelected={selection.includes(index)}
                                            onClick={e => handleSelectionClick(index, e.shiftKey)}
                                            onDisableLocation={e => changeLocations(selectedType, [index], [undefined])}
                                        />
                                    )
                                )
                            }
                        </List >
                    </div >
                </div>
            </Paper>
            <JsonStreamer
                json={devices}
                onChange={(val) => setDevices(val)}
            />
        </div>
    )
}
