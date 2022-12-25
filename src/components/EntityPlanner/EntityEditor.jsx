import { Button, Grid } from '@material-ui/core';
import React from 'react';
import { NumberTextField } from '../ExperimentContext/ExperimentForm/NumberTextField';
import { EntityList } from './EntityList';
import { EntityMap } from './EntityMap';
import { EntityMarker } from './EntityMarker';
import { changeEntityLocation, getEntityLocation } from './EntityUtils';
import { InputSlider } from './InputSlider';
import { MarkedShape } from './MarkedShape';
import { ShapeChooser } from './ShapeChooser';
import { useShape } from './ShapeContext.jsx';
import { SimplifiedSwitch } from './SimplifiedSwitch.jsx';
import { TypeChooser } from './TypeChooser';

export const EntityEditor = ({ entities, setEntities, showOnlyAssigned, setShowOnlyAssigned, experimentDataMaps }) => {
    const [selectedType, setSelectedType] = React.useState(entities.length ? entities[0].name : '');
    const [selection, setSelection] = React.useState([]);
    const [showAll, setShowAll] = React.useState(false);
    const [markedPoints, setMarkedPoints] = React.useState([]);
    const [showName, setShowName] = React.useState(false);
    const [layerChosen, setLayerChosen] = React.useState('OSMMap');
    const [showGrid, setShowGrid] = React.useState(false);
    const [showGridMeters, setShowGridMeters] = React.useState(1);
    const { shape, setShape, rectAngle, setRectAngle, rectRows, setRectRows, shapeOptions, shapeData } = useShape();

    console.log('EntityEditor', layerChosen, entities, showOnlyAssigned, selectedType, showGrid)

    if (selectedType === '' && entities.length > 0) {
        setSelectedType(entities[0].name);
    }

    const changeLocations = (type, indices, newLocations = [undefined]) => {
        let tempEntities = JSON.parse(JSON.stringify(entities));
        let typeEntities = tempEntities.find(d => d.name === type);
        for (let i = 0; i < indices.length; ++i) {
            const loc = newLocations[Math.min(i, newLocations.length - 1)];
            console.log(layerChosen)
            changeEntityLocation(typeEntities.items[indices[i]], typeEntities, loc, layerChosen);
        }
        return tempEntities;
    };

    const handleMapClick = e => {
        // if (selection.length < 1) return;
        const currPoint = [e.latlng.lat, e.latlng.lng];
        if (shape === 'Point') {
            setEntities(changeLocations(selectedType, selection, [currPoint]));
            setMarkedPoints([]);
            setSelection([]);
        } else {
            setMarkedPoints(markedPoints.concat([currPoint]));
        }
    };

    const handlePutEntities = () => {
        const positions = shapeData.toPositions(markedPoints, selection.length);
        setEntities(changeLocations(selectedType, selection, positions));
        setMarkedPoints([]);
        setSelection([]);
    };


    const distanceInMeters = () => {
        const row = (experimentDataMaps || []).find(r => r.imageName === layerChosen);
        return row ? !row.embedded : false;
    }

    return (
        <Grid
            container direction="row-reverse" justifyContent="flex-start" alignItems="stretch"
            style={{ height: '550px' }}
        >
            <Grid item xs={9}>
                <EntityMap
                    onClick={handleMapClick}
                    experimentDataMaps={experimentDataMaps}
                    layerChosen={layerChosen}
                    setLayerChosen={setLayerChosen}
                    showGrid={showGrid}
                    showGridMeters={showGridMeters}
                >
                    {
                        entities.map(devType => {
                            if (showAll || (devType.name === selectedType)) {
                                return devType.items.map((dev, index) => {
                                    const loc = getEntityLocation(dev, devType, layerChosen);
                                    if (!loc) return null;
                                    return <EntityMarker
                                        key={dev.key} entity={dev}
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
                        entityNum={selection.length}
                        distanceInMeters={distanceInMeters()}
                    />

                </EntityMap>
            </Grid>
            <Grid item xs={3} style={{ overflow: 'auto' }}>
                {!entities.length ? null :
                    <>
                        <ShapeChooser
                            onChange={(val) => {
                                if (val === "Point") setMarkedPoints([]);
                            }}
                        />
                        <Button variant="contained" color="primary"
                            disabled={shape === 'Point'}
                            style={{ margin: 5 }}
                            onClick={handlePutEntities}
                        >
                            Put entities
                        </Button>
                        <TypeChooser
                            selectedType={selectedType}
                            onChange={newType => {
                                setSelection([]);
                                setSelectedType(newType);
                            }}
                            showAll={showAll}
                            setShowAll={val => setShowAll(val)}
                            typeOptions={entities.map(dev => { return { name: dev.name } })}
                        />
                        <SimplifiedSwitch
                            label='Entities show name'
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
                        <EntityList
                            selection={selection}
                            setSelection={setSelection}
                            entities={entities.filter(d => d.name === selectedType)}
                            removeEntitiesLocations={(indices) => setEntities(changeLocations(selectedType, indices))}
                            layerChosen={layerChosen}
                        />
                    </>
                }
            </Grid>
        </Grid>
    )
}