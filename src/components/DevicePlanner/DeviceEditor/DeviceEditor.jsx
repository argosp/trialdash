import { Button, InputLabel, Paper, Switch } from '@material-ui/core';
import React, { useRef, useEffect } from 'react';
import { Map as LeafletMap, Polyline } from "react-leaflet";
import { DeviceMarker } from './DeviceMarker';
import { JsonStreamer } from './JsonStreamer';
import { ShapeChooser } from './ShapeChooser';
import { TypeChooser } from './TypeChooser';
import { arcCurveFromPoints, lerpPoint, resamplePolyline, splineCurve, polylineDistance, distToText, rectByAngle } from './Utils';
import { MapLayersControl } from './MapLayersControl';
import { changeDeviceLocation, getDeviceLocation } from './DeviceUtils';
import { InputSlider } from './InputSlider';
import { DeviceList } from './DeviceList';

const position = [32.081128, 34.779729];

export const DeviceEditor = ({ devices, setDevices }) => {
    const mapElement = useRef(null);
    const currPolyline = useRef(null);
    const auxPolyline = useRef(null);

    const [selectedType, setSelectedType] = React.useState(devices[0].name);
    const [selection, setSelection] = React.useState([]);
    const [showAll, setShowAll] = React.useState(false);
    const [shape, setShape] = React.useState("Point");
    const [markedPoints, setMarkedPoints] = React.useState([]);
    const [rectAngle] = React.useState(0);
    const [rectRows, setRectRows] = React.useState(3);
    const [showName, setShowName] = React.useState(false);

    console.log('DeviceEditor', devices)

    const changeLocations = (type, indices, newLocations = [undefined]) => {
        let tempDevices = JSON.parse(JSON.stringify(devices));
        let typeDevices = tempDevices.find(d => d.name === type);
        for (let i = 0; i < indices.length; ++i) {
            const loc = newLocations[Math.min(i, newLocations.length - 1)];
            changeDeviceLocation(typeDevices.items[indices[i]], typeDevices, loc);
        }
        return tempDevices;
    };

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
        mapElement.current.leafletElement.invalidateSize();
        renderShape();
    });

    return (
        <div className="App" style={{ position: 'relative', height: "100vh" }}>
            <LeafletMap
                center={position}
                zoom={15}
                ref={mapElement}
                style={{ height: "100%", width: '70%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
                onClick={handleMapClick}
                onMouseMove={handleMouseMove}
                onMouseOut={handleMouseOut}
                preferCanvas={true}
            >

                <MapLayersControl />

                {
                    devices.map(devType => {
                        if (showAll || (devType.name === selectedType)) {
                            return devType.items.map((dev, index) => {
                                const loc = getDeviceLocation(dev, devType);
                                if (!loc) return null;
                                return <DeviceMarker
                                    key={dev.key} device={dev}
                                    devLocation={loc}
                                    isSelected={selection.includes(index)}
                                    isTypeSelected={devType.name === selectedType}
                                    shouldShowName={showName}
                                />
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
                        <InputSlider text='Rect rows' value={rectRows} setValue={setRectRows} />
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
                        typeOptions={devices.map(dev => { return { name: dev.name } })}
                    />
                    <div style={{ display: 'inline-block', verticalAlign: 'text-top', margin: 5 }}>
                        <InputLabel id="show-all-types" style={{ fontSize: 10 }}>Devices show name</InputLabel>
                        <Switch id="show-all-types" color="primary" inputProps={{ 'aria-label': 'primary checkbox' }}
                            value={showName}
                            onChange={e => setShowName(e.target.checked)}
                        />
                    </div>

                    <DeviceList
                        selection={selection}
                        setSelection={setSelection}
                        devices={devices.filter(d => d.name === selectedType)}
                        removeDeviceLocation={(index) => setDevices(changeLocations(selectedType, [index]))}
                    />

                </div>
            </Paper>
            <JsonStreamer
                json={devices}
                onChange={(val) => setDevices(val)}
            />
        </div>
    )
}