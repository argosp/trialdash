import { Button, InputLabel, Switch, Grid, Box, Container, Divider } from '@material-ui/core';
import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import EntitiesTypesTable from './new/ToBePositionTable/EntitiesTypesTable';
import EditTable from './new/ToBePositionTable/EditTable'
import MapTypesList from './new/ToBePositionTable/MapTypesList'
import EntityTypeFilter from './new/ToBePositionTable/EntityTypeFilter';
import SearchInput from './new/ToBePositionTable/SearchInput';
import DeviceRow from './new/ToBePositionTable/EntityTypeRow';
import TBPButtons from './new/ToBePositionTable/TBPButtons'
import DnDEntityZone from './new/ToBePositionTable/DnDEntityZone'
import { isEmpty, isArray, isObject } from 'lodash'
import { NumberTextField } from '../ExperimentContext/ExperimentForm/NumberTextField';
import { EntityList } from './EntityList';
import { EntityMap } from './EntityMap';
import { EntityMarker } from './EntityMarker';
import { changeEntityLocation, getEntityLocation } from './EntityUtils';
import { arcCurveFromPoints, lerpPoint, rectByAngle, resamplePolyline, splineCurve } from './GeometryUtils';
import { InputSlider } from './InputSlider';
import { MarkedShape } from './MarkedShape';
import ToBePositionTable from './new';
import { ShapeChooser } from './ShapeChooser';
import { TypeChooser } from './TypeChooser';
import { makeStyles } from "@material-ui/core/styles";
import { styles } from './new/ToBePositionTable/styles'
import {
    INIT_MODE,
    SELECT_MODE,
    EDIT_MODE,
    LOCATIONS_MODE
} from './new/ToBePositionTable/utils/constants'

const SimplifiedSwitch = ({ label, value, setValue }) => (
    <div style={{ display: 'inline-block', margin: 5 }}>
        <InputLabel style={{ fontSize: 10 }}>{label}</InputLabel>
        <Switch color="primary" inputProps={{ 'aria-label': 'primary checkbox' }}
            value={value}
            onChange={e => setValue(e.target.checked)}
        />
    </div>
)

const useStyles = makeStyles(styles);

const WidthDivider = () => <Divider light style={{ position: 'absolute', left: 0, width: '100%' }} />

export const EntityEditor = ({ entities, setEntities, showOnlyAssigned, setShowOnlyAssigned, experimentDataMaps }) => {
    const classes = useStyles();
    // selectedType is an object of true values for each key, each key is string of selected entity type
    const [selectedType, setSelectedType] = React.useState({});
    // selection is array of indexs sorted 
    const [selection, setSelection] = React.useState([]);
    const [showAll, setShowAll] = React.useState(true);
    const [addEntityMode, setAddEntityMode] = React.useState(INIT_MODE)
    const [shape, setShape] = React.useState("Point");
    const [markedPoints, setMarkedPoints] = React.useState([]);
    const [rectAngle] = React.useState(0);
    const [rectRows, setRectRows] = React.useState(3);
    const [showName, setShowName] = React.useState(false);
    const [layerChosen, setLayerChosen] = React.useState('OSMMap');
    const [showGrid, setShowGrid] = React.useState(false);
    const [showGridMeters, setShowGridMeters] = React.useState(1);
    const [TBPEntities, setTBPEntities] = React.useState([]);
    // const [mapType, setMapType] = React.useState("concourse");
    const [isDragging, setIsDragging] = React.useState(false)
    const [filteredTBPEntities, setFilteredTBPEntities] = React.useState([]);
    // entitiesTypesInstances => each entity type items, sorted by index for DnD implementation
    const [entitiesTypesInstances, setEntitiesTypesInstances] = React.useState([])
    useEffect(() => setEntitiesTypesInstances(entities.reduce((prev, curr) => [...prev, ...curr.items], [])), [entities])

    const handleFilterDevices = (filter) => {
        console.log(filter)
        // setFilteredTBPEntities(filter)
    }

    const handleMapTypeChange = (value) => {
        // setLayerChosen(value)
    }

    const handleShowEntitiesOnMap = (entityTypeName) => {

        setSelectedType(prev => ({
            ...prev,
            [entityTypeName]: !selectedType[entityTypeName]
        }))
    }

    const handleModeChange = (mode) => {

        if (mode === EDIT_MODE && TBPEntities.length < 1) {
            alert('No entities to position!')
            return
        }
        if (mode === INIT_MODE && TBPEntities.length > 0) {
            if (!window.confirm('This action will cancel all the process so far. Continue?'))
                return
            removeEntityFromTBPTable([]);
        }
        setAddEntityMode(mode)

    }

    const findEntityTypeName = (key) => entities.find(e => e.key === key)

    const onDragStart = () => {
        setIsDragging(true);
    };

    const onDragEnd = ({ source, destination }) => {
        setIsDragging(false);

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId !== destination.droppableId) {
            const draggedEntity = entitiesTypesInstances[source.index]
            addEntityToTBPTable(draggedEntity)
            setEntitiesTypesInstances(p => p.filter(({ key }) => key !== draggedEntity.key))
        }
    };
    console.log('EntityEditor', layerChosen, entities, showOnlyAssigned, selectedType, showGrid)

    useEffect(() => {
        setSelectedType(() => entities.reduce((prev, entityType) => ({ ...prev, [entityType.name]: true }), {}));
    }, [entities])

    if (selectedType === '' && entities.length > 0) {
        setSelectedType(entities[0].name);
    }

    const handleMarkerClick = (entity) => {
        if (addEntityMode === INIT_MODE)
            setAddEntityMode(EDIT_MODE)

        addEntityToTBPTable(entity)
    }

    const removeEntityFromTBPTable = (entity) => {
        if (isArray(entity) && isEmpty(entity)) {
            handleTBPEntities([])
            return
        }
        const parentEntity = TBPEntities.find(({ key }) => key === entity.entitiesTypeKey)
        if (parentEntity.items.length < 2) {
            handleTBPEntities(prev => prev.filter(et => et.key !== parentEntity.key))
        }
        else {
            handleTBPEntities(prev => {
                return prev.map(et => {
                    if (et.key === parentEntity.key)
                        return { ...et, items: et.items.filter(e => e.key !== entity.key) }
                    return et
                })
            })
        }
    }

    const addEntityToTBPTable = (entity) => {
        // const draggedEntity = entitiesTypesInstances[source.index]
        const parentEntity = TBPEntities.find(({ key }) => key === entity.entitiesTypeKey)
        if (parentEntity) {
            handleTBPEntities(prev => (prev.map(entityType => {
                if (entityType.key === parentEntity.key) {
                    return { ...parentEntity, items: [...parentEntity.items, entity] }
                }
                return entityType
            }
            )
            ));
        } else {
            const _parentEntity = entities.find(({ key }) => key === entity.entitiesTypeKey)
            handleTBPEntities(prev => ([
                ...prev,
                {
                    ..._parentEntity,
                    items: [entity]
                }
            ]));
        }
    }
    const handleTBPEntities = (tbpEntities) => {
        setTBPEntities(tbpEntities)
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

    const handlePutEntities = (_shape) => {
        let selectionsCounter = 0;
        const positions = shapeData(_shape)
            .toPositions(TBPEntities.reduce((prev, curr) => {
                selectionsCounter++;
                const locations = curr.properties[curr.properties.length - 1].val;
                if (isObject(locations) && isArray(locations.coordinates)) {
                    return [...prev, locations.coordinates]
                }
                return [...prev, [24, 24]]

            }, []), selectionsCounter);
        setEntities(changeLocations(selectedType, selectionsCounter, positions));
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
            <Grid item xs={9} >
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
                            if (selectedType[devType.name]) {
                                return devType.items.map((dev, index) => {
                                    const loc = getEntityLocation(dev, devType, layerChosen);
                                    if (!loc) return null;
                                    return <EntityMarker
                                        key={dev.key} entity={dev}
                                        devLocation={loc}
                                        isSelected={selection.includes(index)}
                                        isTypeSelected={devType.name === selectedType}
                                        shouldShowName={showName}
                                        handleMarkerClick={handleMarkerClick}
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
                        entityNum={selection.length}
                        distanceInMeters={distanceInMeters()}
                    />

                </EntityMap>
            </Grid>
            {/* To be position Table */}
            <Grid item xs={3} style={{ overflow: 'inherit', backgroundColor: '#f5f5f5' }}>
                <Container disableGutters className={classes.container}>
                    <MapTypesList
                        layerChosen={layerChosen}
                        handleMapTypeChange={handleMapTypeChange}

                    />

                    <WidthDivider />

                    <EntityTypeFilter
                        classes={classes}
                        handleFilterDevices={handleFilterDevices}
                        entitiesNames={entities.map(device => device.name)}
                    />

                    <WidthDivider />

                    <SearchInput />

                    <WidthDivider />

                    <DragDropContext
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                    >
                        <Box overflow='auto' bgcolor='inherit' maxHeight={250} >
                            {

                                <DnDEntityZone
                                    addEntityMode={addEntityMode}
                                    TBPEntities={TBPEntities}
                                    isDragging={isDragging}
                                    findEntityTypeName={findEntityTypeName}
                                />
                            }

                            {
                                entities.length > 0 ?
                                    entities.map((entity) => <DeviceRow key={entity.key} entity={entity} onClick={handleShowEntitiesOnMap} />)
                                    :
                                    <p> No entities to show</p>

                            }

                        </Box>

                        <Box width='100%' bgcolor='inherit' >

                            <TBPButtons
                                addEntityMode={addEntityMode}
                                handleModeChange={handleModeChange}
                            />

                        </Box>
                        {
                            addEntityMode === SELECT_MODE &&
                            <EntitiesTypesTable
                                classes={classes}
                                entities={entities}
                                entitiesTypesInstances={entitiesTypesInstances}
                                setAddEntityMode={setAddEntityMode}

                            />
                        }
                        {
                            addEntityMode === EDIT_MODE &&
                            <EditTable
                                TBPEntities={TBPEntities}
                                removeEntityFromTBPTable={removeEntityFromTBPTable}

                            />
                        }
                    </DragDropContext>
                </Container>
            </Grid>

            {/* <Grid item xs={3} style={{ overflow: 'auto' }}>
                {console.log(entities)}
                {!entities.length ? null :
                    <>
                        <ShapeChooser
                            shape={shape}
                            onChange={(val) => {
                                if (val === "Point") setMarkedPoints([]);
                                setShape(val)
                            }}
                            shapeOptions={shapeOptions}
                        />
                        {shape !== 'Rect' ? null :
                            <InputSlider text='Rect rows' value={rectRows} setValue={setRectRows} />
                        }
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
            </Grid> */}
        </Grid>
    )
}