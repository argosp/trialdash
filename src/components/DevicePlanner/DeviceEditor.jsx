import { Button, InputLabel, Paper, Switch } from '@material-ui/core';
import React from 'react';
import { DeviceList } from './DeviceList';
import { DeviceMap } from './DeviceMap';
import { DeviceMarker } from './DeviceMarker';
import { changeDeviceLocation, getDeviceLocation } from './DeviceUtils';
import { arcCurveFromPoints, lerpPoint, rectByAngle, resamplePolyline, splineCurve } from './GeometryUtils';
import { InputSlider } from './InputSlider';
import { MarkedShape } from './MarkedShape';
import { ShapeChooser } from './ShapeChooser';
import { TypeChooser } from './TypeChooser';

export const DeviceEditor = ({ devices, setDevices, showOnlyAssigned, setShowOnlyAssigned }) => {
    const [selectedType, setSelectedType] = React.useState(devices.length ? devices[0].name : '');
    const [selection, setSelection] = React.useState([]);
    const [showAll, setShowAll] = React.useState(false);
    const [shape, setShape] = React.useState("Point");
    const [markedPoints, setMarkedPoints] = React.useState([]);
    const [rectAngle] = React.useState(0);
    const [rectRows, setRectRows] = React.useState(3);
    const [showName, setShowName] = React.useState(false);

    console.log('DeviceEditor', devices, showOnlyAssigned, selectedType)

    if (selectedType === '' && devices.length > 0) {
        setSelectedType(devices[0].name);
    }

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
            toPositions: (points, amount) => amount && points.length ? [points[0]] : []
        },
        {
            name: 'Poly',
            toLine: points => [points],
            toPositions: (points, amount) => resamplePolyline(points, amount)
        },
        {
            name: 'Curve',
            toLine: points => [splineCurve(points, 100)],
            toPositions: (points, amount) => resamplePolyline(splineCurve(points, 100), amount)
        },
        {
            name: 'Arc',
            toLine: points => {
                if (points.length <= 2) return [points];
                const arc = arcCurveFromPoints(points, 400);
                return [[points[0], arc[0]], arc];
            },
            toPositions: (points, amount) => resamplePolyline(arcCurveFromPoints(points, 400), amount)
        },
        {
            name: 'Rect',
            toLine: (points, angle = rectAngle) => {
                const [nw, ne, se, sw] = rectByAngle(points, angle);
                return [[nw, ne, se, sw, nw]];
            },
            toPositions: (points, amount, rows = rectRows, angle = rectAngle) => {
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
            }
        }
    ];

    const handlePutDevices = () => {
        const positions = shapeData().toPositions(markedPoints, selection.length);
        setDevices(changeLocations(selectedType, selection, positions));
        setMarkedPoints([]);
        setSelection([]);
    };

    const shapeData = () => shapeOptions.find(s => s.name === shape);

    return (
        <div className="App" style={{ position: 'relative', height: "100vh" }}>
            <DeviceMap
                onClick={handleMapClick}
            >
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

                <MarkedShape
                    markedPoints={markedPoints}
                    setMarkedPoints={setMarkedPoints}
                    shape={shape}
                    shapeCreator={shapeData()}
                    deviceNum={selection.length}
                />

            </DeviceMap>
            <div style={{
                position: 'absolute', width: '28%', top: 0, bottom: 0, left: 0, zIndex: 1000
            }}>
                <Paper style={{
                    position: 'absolute', height: '100%', overflow: 'auto', top: 0, width: '100%'
                }} >
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
                        {!devices.length ? null :
                            <>
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
                                <div style={{ display: 'inline-block', verticalAlign: 'text-top', margin: 5 }}>
                                    <InputLabel id="show-all-types" style={{ fontSize: 10 }}>Show only assigned</InputLabel>
                                    <Switch id="show-all-types" color="primary" inputProps={{ 'aria-label': 'primary checkbox' }}
                                        value={showOnlyAssigned}
                                        onChange={e => setShowOnlyAssigned(e.target.checked)}
                                    />
                                </div>

                                <DeviceList
                                    selection={selection}
                                    setSelection={setSelection}
                                    devices={devices.filter(d => d.name === selectedType)}
                                    removeDeviceLocation={(index) => setDevices(changeLocations(selectedType, [index]))}
                                />
                            </>
                        }
                    </div>
                </Paper>
            </div>
        </div>
    )
}