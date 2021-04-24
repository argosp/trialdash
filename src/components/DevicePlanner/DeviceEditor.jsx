import { Button, InputLabel, Paper, Switch, Grid } from '@material-ui/core';
import React from 'react';
import { NumberTextField } from '../ExperimentContext/ExperimentForm/NumberTextField';
import { DeviceList } from './DeviceList';
import { DeviceMap } from './DeviceMap';
import { DeviceMarker } from './DeviceMarker';
import { changeDeviceLocation, getDeviceLocation } from './DeviceUtils';
import { arcCurveFromPoints, lerpPoint, rectByAngle, resamplePolyline, splineCurve } from './GeometryUtils';
import { InputSlider } from './InputSlider';
import { MarkedShape } from './MarkedShape';
import { ShapeChooser } from './ShapeChooser';
import { TypeChooser } from './TypeChooser';

const SimplifiedSwitch = ({ label, value, setValue }) => (
    <div style={{ display: 'inline-block', margin: 5 }}>
        <InputLabel style={{ fontSize: 10 }}>{label}</InputLabel>
        <Switch color="primary" inputProps={{ 'aria-label': 'primary checkbox' }}
            value={value}
            onChange={e => setValue(e.target.checked)}
        />
    </div>
)

export const DeviceEditor = ({ devices, setDevices, showOnlyAssigned, setShowOnlyAssigned, experimentDataMaps }) => {
    const [selectedType, setSelectedType] = React.useState(devices.length ? devices[0].name : '');
    const [selection, setSelection] = React.useState([]);
    const [showAll, setShowAll] = React.useState(false);
    const [shape, setShape] = React.useState("Point");
    const [markedPoints, setMarkedPoints] = React.useState([]);
    const [rectAngle] = React.useState(0);
    const [rectRows, setRectRows] = React.useState(3);
    const [showName, setShowName] = React.useState(false);
    const [layerChosen, setLayerChosen] = React.useState('OSMMap');
    const [showGrid, setShowGrid] = React.useState(false);
    const [showGridMeters, setShowGridMeters] = React.useState(1);

    console.log('DeviceEditor', layerChosen, devices, showOnlyAssigned, selectedType, showGrid)

    if (selectedType === '' && devices.length > 0) {
        setSelectedType(devices[0].name);
    }

    const changeLocations = (type, indices, newLocations = [undefined]) => {
        let tempDevices = JSON.parse(JSON.stringify(devices));
        let typeDevices = tempDevices.find(d => d.name === type);
        for (let i = 0; i < indices.length; ++i) {
            const loc = newLocations[Math.min(i, newLocations.length - 1)];
            console.log(layerChosen)
            changeDeviceLocation(typeDevices.items[indices[i]], typeDevices, loc, layerChosen);
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
            }
        }
    ];

    const shapeData = shapeOptions.find(s => s.name === shape);

    const handlePutDevices = () => {
        const positions = shapeData.toPositions(markedPoints, selection.length);
        setDevices(changeLocations(selectedType, selection, positions));
        setMarkedPoints([]);
        setSelection([]);
    };


    const distanceInMeters = () => {
        const row = (experimentDataMaps || []).find(r => r.imageName === layerChosen);
        return row ? !row.embedded : false;
    }

    return (
        <Grid
            container direction="row-reverse" justify="flex-start" alignItems="stretch"
            style={{ height: '550px' }}
        >
            <Grid item xs={9}>
                <DeviceMap
                    onClick={handleMapClick}
                    experimentDataMaps={experimentDataMaps}
                    layerChosen={layerChosen}
                    setLayerChosen={setLayerChosen}
                    showGrid={showGrid}
                    showGridMeters={showGridMeters}
                >
                    {
                        devices.map(devType => {
                            if (showAll || (devType.name === selectedType)) {
                                return devType.items.map((dev, index) => {
                                    const loc = getDeviceLocation(dev, devType, layerChosen);
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
                        shapeCreator={shapeData}
                        deviceNum={selection.length}
                        distanceInMeters={distanceInMeters()}
                    />

                </DeviceMap>
            </Grid>
            <Grid item xs={3} style={{ overflow: 'auto' }}>
                {!devices.length ? null :
                    <>
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
                        <SimplifiedSwitch
                            label='Devices show name'
                            value={showName}
                            setValue={v => setShowName(v)}
                        />
                        <SimplifiedSwitch
                            label='Show only assigned'
                            value={showOnlyAssigned}
                            setValue={v => setShowOnlyAssigned(v)}
                        />
                        {layerChosen === 'OSMMap' ? null :
                            <div style={{ verticalAlign: 'baseline' }}>
                                <SimplifiedSwitch
                                    label='Show grid'
                                    value={showGrid}
                                    setValue={v => setShowGrid(v)}
                                />
                                <NumberTextField
                                    label='Grid Meters'
                                    value={showGridMeters}
                                    onChange={v => setShowGridMeters(v)}
                                />
                            </div>
                        }
                        <DeviceList
                            selection={selection}
                            setSelection={setSelection}
                            devices={devices.filter(d => d.name === selectedType)}
                            removeDeviceLocation={(index) => setDevices(changeLocations(selectedType, [index]))}
                            layerChosen={layerChosen}
                        />
                    </>
                }
            </Grid>
        </Grid>
    )
}