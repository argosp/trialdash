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
import { isEmpty, isArray, isObject, fromPairs } from 'lodash'
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
import { MarkContextmenu } from './MarkContextmenu';

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
    // older selectType is string selected entity type name
    // selectedType is an object of true values for each key, each key is string of selected entity type
    const [selectedType, setSelectedType] = React.useState({});
    // selection is array of indexes sorted, those indexes points to selected entities in specific entity type
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
    const [isDragging, setIsDragging] = React.useState(false)
    const [filteredEntities, setFilteredEntities] = React.useState([]);
    const [entitiesTypesInstances, setEntitiesTypesInstances] = React.useState([]);
    /**
     * @const {array} TPEntities - contains the selected entities
     */
    const [TPEntities, setTPEntities] = React.useState([]);
    /**
     * @const {array} entitiesTypes - contains the source entities array, for prev presentation of edit
     */
    const [entitiesTypes, setEntitiesTypes] = React.useState([]);
    const [toggleMenu, setToggleMenu] = React.useState(false);
    const [anchorPoint, setAnchorPoint] = React.useState({});
    useEffect(() => {
        setEntitiesTypes(JSON.parse(JSON.stringify(entities)));
        setEntitiesTypesInstances(entities.reduce((prev, curr) => [...prev, ...curr.items], []))
        setSelectedType(entities.reduce((prev, entityType) => ({ ...prev, [entityType.name]: true }), {}))
        console.log("entities changed", entities)
    }, [entities])
    useEffect(() => console.log(entitiesTypes), [entitiesTypes])
    const handleFilterDevices = (filter) => {
        const filtered = entitiesTypes.filter(e => !!filter[e.name])
        setFilteredEntities(filtered)
    }
    const handleSearchEntities = (input) => {
        const filtered = entitiesTypes.reduce((prev, entityType) => entityType.name.toLowerCase().includes(input.toLowerCase()) ? [...prev, entityType] : [...prev], [])
        setFilteredEntities(filtered)
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

    const findEntityTypeName = (key) => entitiesTypes.find(e => e.key === key)

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
            addEntityToTBPTableFromDnD(entitiesTypesInstances[source.index])
        }
    };
    console.log('EntityEditor', layerChosen, entities, showOnlyAssigned, selectedType, showGrid)



    if (selectedType === '' && entitiesTypes.length > 0) {
        setSelectedType(entities[0].name);
    }

    const handleMarkerClick = (entity) => {
        if (addEntityMode === INIT_MODE)
            setAddEntityMode(EDIT_MODE)

        addEntityToTBPTable(entity)
    }

    const handleContextMenuClick = e => {
        const { x, y } = e.containerPoint;
        const { lat, lng } = e.latlng;
        if (!toggleMenu) {
            setToggleMenu(true);
            setAnchorPoint({ x, y, mapX: lat, mapY: lng });
            return;
        }
        else if (anchorPoint.x !== x || anchorPoint.y !== y) {
            setAnchorPoint({ x, y, mapX: lat, mapY: lng });
        }
        else {
            setToggleMenu(p => !p);
        }
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
    /**
     * this function add entity type to TBPEntites state with the selected entity
     * @param {object} entity - item of entity type
     */
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
            const _parentEntity = entitiesTypes.find(({ key }) => key === entity.entitiesTypeKey)
            handleTBPEntities(prev => ([
                ...prev,
                {
                    ..._parentEntity,
                    items: [entity]
                }
            ]));
        }
    }

    const addEntityToTBPTableFromDnD = (entity) => {
        addEntityToTBPTable(entity)
        setEntitiesTypesInstances(p => p.filter(({ key }) => key !== entity.key))
    }

    const handleTBPEntities = (tbpEntities) => {
        setTBPEntities(tbpEntities)
    }

    const cleanTBPTable = () => {
        setTBPEntities([]);
        setTPEntities([]);
        setEntitiesTypesInstances(entities.reduce((prev, curr) => [...prev, ...curr.items], []))
        setSelectedType(entities.reduce((prev, entityType) => ({ ...prev, [entityType.name]: true }), {}))
        if (addEntityMode !== INIT_MODE) setEntitiesTypes(JSON.parse(JSON.stringify(entities)))

    }

    // to positions entities, selected to position after TBPEntities 
    const handleTPEntities = (entity) => {
        !!TPEntities.find(e => e.key === entity.key) ?
            setTPEntities(p => p.filter(v => v.key !== entity.key)) :
            setTPEntities(p => [...p, entity])
    }
    /**
     * 
     * @param {string} type - the name of parent entity type
     * @param {array} indices - array of indexes sorted, those indexes points to selected entities in specific entity type
     * @param {number[][]} newLocations - array of arrays, each array holds 2 values as with type number. Points on new location of selected entities
     * @returns 
     */
    const changeLocations = (type, indices, newLocations = [undefined]) => {
        // deep copy of entities
        let tempEntities = JSON.parse(JSON.stringify(entitiesTypes));
        console.log(type, indices)
        // shallow copy of object in tempEntities (the d copy of entities)
        let typeEntities = tempEntities.find(d => d.name === type);
        console.log(typeEntities)
        for (let i = 0; i < indices.length; ++i) {
            const loc = newLocations[Math.min(i, newLocations.length - 1)];
            console.log(typeEntities.items[indices[i]], indices[i], indices, typeEntities)
            changeEntityLocation(typeEntities.items[indices[i]], typeEntities, loc, layerChosen);
        }
        return tempEntities;
    };

    const handleMapClick = e => {
        setToggleMenu(false);
        if ((shape === 'Point' && shape === 'Free') && TPEntities.length < 1) return;
        console.log(TPEntities)

        const currPoint = [e.latlng.lat, e.latlng.lng];
        if (shape === 'Point' || shape === 'Free') {
            let _selection = [];
            let entityType = null;
            for (let i = 0; i < TPEntities.length; i++) {
                const entity = TPEntities[i];
                entityType = findEntityTypeName(entity.entitiesTypeKey)
                _selection.push(entityType.items.findIndex(e => e.key === entity.key))
                console.log(entityType)
            }
            setEntitiesTypes(changeLocations(entityType.name, _selection.sort(), [currPoint]));
            // setEntities(changeLocations(entityType.name, _selection.sort(), [currPoint]));
            setTPEntities([])
            setMarkedPoints([]);
            setSelection([]);
        } else {
            setMarkedPoints(markedPoints.concat([currPoint]));
        }
    };

    const shapeOptions = [
        {
            name: 'Free',
            toLine: points => [],
            toPositions: (points, amount) => amount && points.length ? [points[0]] : []
        },
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
    // const handlePutEntities = () => {
    //     const positions = shapeData.toPositions(markedPoints, selection.length);
    //     setEntities(changeLocations(selectedType, selection, positions));
    //     setMarkedPoints([]);
    //     setSelection([]);
    // };

    const applyMenuRows = (dev) => [
        {
            onClick:
                () => {
                    addEntityToTBPTable(dev);
                    if (TBPEntities.length < 1) setAddEntityMode(EDIT_MODE)
                }
            , text: 'Edit'
        },
        {
            onClick:
                () => {

                    if (TBPEntities.length < 2) { setAddEntityMode(INIT_MODE); cleanTBPTable(); }
                    const parentEntity = findEntityTypeName(dev.entitiesTypeKey);
                    const childIndex = parentEntity.items.findIndex(({ key }) => key === dev.key);
                    if (addEntityMode !== INIT_MODE)
                        setEntitiesTypes(changeLocations(parentEntity.name, [childIndex]))
                    else
                        setEntities(changeLocations(parentEntity.name, [childIndex]))
                }
            , text: 'Remove'
        },
    ]

    const handlePutEntitiesOnPrev = () => {
        //        const positions = shapeData.toPositions(markedPoints, selection.length);
        // to -> 
        //        const positions = shapeData.toPositions(markedPoints, TPEntities.length);

        const positions = shapeData.toPositions(markedPoints, TPEntities.length);
        let _selection = [];
        const parentEntity = findEntityTypeName(TPEntities[0].entitiesTypeKey);
        let entityType = null;
        for (let i = 0; i < TPEntities.length; i++) {
            const { key } = TPEntities[i];
            _selection.push(entityType.items.findIndex(e => e.key === key))
        }
        // const _positions = TPEntities.reduce((prev, curr) => {
        //     selectionsCounter.push(parentEntity.items.findIndex(({ key }) => key === curr.key));
        //     const locations = curr.properties[curr.properties.length - 1].val;
        //     if (isObject(locations) && isArray(locations.coordinates)) {
        //         return [...prev, locations.coordinates]
        //     }
        //     return [...prev, [34, 32]]
        // }, [])
        // const positions = shapeData.toPositions(_positions, selectionsCounter.length);
        setEntitiesTypes(changeLocations(parentEntity.name, _selection.sort(), positions));
        setMarkedPoints([]);
        setSelection([]);
    };

    const handlePutEntities = () => {
        setEntities(entitiesTypes);
        setMarkedPoints([]);
        setSelection([]);
        cleanTBPTable();
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
                        (filteredEntities.length > 0 ? filteredEntities : entitiesTypes)
                            .map(devType => {
                                if (selectedType[devType.name]) {
                                    const tbpParent = TBPEntities.find(({ key }) => devType.key === key) || null;
                                    return devType.items.map((dev, index) => {
                                        const loc = getEntityLocation(dev, devType, layerChosen);
                                        if (!loc) return null;
                                        const isOnEdit = (isObject(tbpParent) && tbpParent.items.findIndex(({ key }) => dev.key === key) !== -1)
                                        return (<>
                                            <EntityMarker
                                                key={dev.key} entity={dev}
                                                devLocation={loc}
                                                isSelected={selection.includes(index)}
                                                isTypeSelected={devType.name === selectedType}
                                                isOnEdit={isOnEdit}
                                                shouldShowName={showName}
                                                handleMarkerClick={handleMarkerClick}
                                                onContextMenu={handleContextMenuClick}
                                            />

                                            {
                                                toggleMenu &&
                                                <MarkContextmenu
                                                    position={{ y: anchorPoint.y, x: anchorPoint.x, }}
                                                    applyMenuRows={() => applyMenuRows(dev)}
                                                    isShow={loc[0] === anchorPoint.mapX && loc[1] === anchorPoint.mapY}
                                                    onClose={() => setToggleMenu(false)}
                                                />
                                            }
                                        </>
                                        )
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
                        entitiesNames={entitiesTypes.map(device => device.name)}
                    />

                    <WidthDivider />

                    <SearchInput
                        onSearch={handleSearchEntities}
                    />

                    <WidthDivider />

                    <DragDropContext
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                    >
                        <Box overflow='auto' bgcolor='inherit' maxHeight={250} minHeight={200} >
                            {

                                <DnDEntityZone
                                    addEntityMode={addEntityMode}
                                    TBPEntities={TBPEntities}
                                    isDragging={isDragging}
                                    findEntityTypeName={findEntityTypeName}
                                    handleTPEntities={handleTPEntities}
                                    TPEntities={TPEntities}
                                />
                            }

                            {
                                entitiesTypes.length > 0 ?
                                    (filteredEntities.length > 0 ? filteredEntities : entitiesTypes)
                                        .map((entity) => <DeviceRow key={entity.key} entity={entity} onClick={handleShowEntitiesOnMap} />)
                                    :
                                    <p> No entities to show</p>

                            }

                        </Box>

                        <Box width='100%' bgcolor='inherit' >

                            <TBPButtons
                                addEntityMode={addEntityMode}
                                handleModeChange={handleModeChange}
                                setShowName={setShowName}
                                onCancel={() => cleanTBPTable()}
                                onSubmit={() => handlePutEntities()}
                            />

                        </Box>
                        {
                            addEntityMode === SELECT_MODE &&
                            <EntitiesTypesTable
                                classes={classes}
                                entities={entitiesTypes}
                                entitiesTypesInstances={entitiesTypesInstances}
                                setAddEntityMode={setAddEntityMode}
                                addEntityToTBPTableFromDnD={addEntityToTBPTableFromDnD}
                                removeEntityLocation={(entityTypeName, indices) => setEntities(changeLocations(entityTypeName, indices))}
                            />
                        }
                        {
                            addEntityMode === EDIT_MODE &&
                            <EditTable
                                TBPEntities={TBPEntities}
                                removeEntityFromTBPTable={removeEntityFromTBPTable}
                                onShapeChange={v => setShape(v)}
                                onSingleShapeSubmit={handleMapClick}
                                handlePutEntitiesOnPrev={handlePutEntitiesOnPrev}
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