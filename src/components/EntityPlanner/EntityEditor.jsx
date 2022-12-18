import React, { useEffect, useState } from 'react';
import { Box, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { group } from '@uiw/react-md-editor';
import { isArray, isEmpty, isObject } from 'lodash';
import { DragDropContext } from 'react-beautiful-dnd';
import { EntityMap } from './EntityMap';
import { EntityMarker } from './EntityMarker';
import { changeEntityLocation, getEntityLocation } from './EntityUtils';
import { MarkContextmenu } from './MarkContextmenu';
import { MarkedShape } from './MarkedShape';
import DnDEntityZone from './new/ToBePositionTable/DnDEntityZone';
import { EditTable } from './new/ToBePositionTable/EditTable/EditTable';
import EntitiesTypesTable from './new/ToBePositionTable/EntitiesTypesTable';
import EntityTypeFilter from './new/ToBePositionTable/EntityTypeFilter';
import DeviceRow from './new/ToBePositionTable/EntityTypeRow';
import MapTypesList from './new/ToBePositionTable/MapTypesList';
import SearchInput from './new/ToBePositionTable/SearchInput';
import { styles } from './new/ToBePositionTable/styles';
import TBPButtons from './new/ToBePositionTable/TBPButtons';
import { EDIT_MODE, INIT_MODE, SELECT_MODE } from './new/ToBePositionTable/utils/constants';
import uuid from 'uuid/v4';
import { WidthDivider } from './WidthDivider';
import { useShapeGeometry } from './useShapeGeometry';

const useStyles = makeStyles(styles);

export const EntityEditor = ({
  entities,
  setEntities,
  showOnlyAssigned,
  setShowOnlyAssigned,
  experimentDataMaps,
}) => {
  const classes = useStyles();
  // older selectType is string selected entity type name
  // selectedType is an object of true values for each key, each key is string of selected entity type
  const [selectedType, setSelectedType] = useState({});
  // selection is array of indexes sorted, those indexes points to selected entities in specific entity type
  const [selection, setSelection] = useState([]);
  const [addEntityMode, setAddEntityMode] = useState(INIT_MODE);
  const [markedPoints, setMarkedPoints] = useState([]);
  const [rectAngle] = useState(0);
  const [rectRows, setRectRows] = useState(3);
  const [showName, setShowName] = useState(false);
  const [layerChosen, setLayerChosen] = useState('OSMMap');
  const [showGrid, setShowGrid] = useState(false);
  const [showGridMeters, setShowGridMeters] = useState(1);
  const [TBPEntities, setTBPEntities] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [entitiesTypesInstances, setEntitiesTypesInstances] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  /**
   * @const {array} TPEntities - contains the selected entities
   */
  const [TPEntities, setTPEntities] = useState([]);
  /**
   * @const {array} entitiesTypes - contains the source entities array, for prev presentation of edit
   */
  const [entitiesTypes, setEntitiesTypes] = useState([]);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({});

  const [shape, setShape] = useState('Point');
  const { shapeToLine, shapeToPositions } = useShapeGeometry({ shape, rectAngle, rectRows });

  useEffect(() => {
    setEntitiesTypes(JSON.parse(JSON.stringify(entities)));
    setEntitiesTypesInstances(entities.reduce((prev, curr) => [...prev, ...curr.items], []));
    setSelectedType(
      entities.reduce((prev, entityType) => ({ ...prev, [entityType.name]: true }), {})
    );
  }, [entities]);

  const handleFilterDevices = (filter) => {
    const filtered = entitiesTypes.filter((e) => !!filter[e.name]);
    if (filtered.length) {
      setIsFiltered(true);
    } else {
      setIsFiltered(false);
    }
    setFilteredEntities(filtered);
  };

  const handleSearchEntities = (input) => {
    const filtered = entitiesTypes.reduce(
      (prev, entityType) =>
        entityType.name.toLowerCase().includes(input.toLowerCase())
          ? [...prev, entityType]
          : [...prev],
      []
    );
    setFilteredEntities(filtered);
  };

  const handleMapTypeChange = () => {
    // setLayerChosen(value)
  };

  const handleShowEntitiesOnMap = (entityTypeName) => {
    setSelectedType((prev) => ({
      ...prev,
      [entityTypeName]: !selectedType[entityTypeName],
    }));
  };

  const handleModeChange = (mode) => {
    if (mode === EDIT_MODE && TBPEntities.length < 1) {
      alert('No entities to position!');
      return;
    }
    if (mode === INIT_MODE && TBPEntities.length > 0) {
      if (!window.confirm('This action will cancel all the process so far. Continue?')) return;
      removeEntityFromTBPTable([]);
    }
    setAddEntityMode(mode);
  };

  const findEntityTypeName = (key) => entitiesTypes.find((e) => e.key === key);

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
      addEntityToTBPTableFromDnD(entitiesTypesInstances[source.index]);
    }
  };

  if (selectedType === '' && entitiesTypes.length > 0) {
    setSelectedType(entities[0].name);
  }

  const handleMarkerClick = (entity) => {
    if (addEntityMode === INIT_MODE) setAddEntityMode(EDIT_MODE);

    addEntityToTBPTable(entity);
  };

  const handleContextMenuClick = (e) => {
    const { x, y } = e.containerPoint;
    const { lat, lng } = e.latlng;
    if (!toggleMenu) {
      setToggleMenu(true);
      setAnchorPoint({ x, y, mapX: lat, mapY: lng });
      return;
    } else if (anchorPoint.x !== x || anchorPoint.y !== y) {
      setAnchorPoint({ x, y, mapX: lat, mapY: lng });
    } else {
      setToggleMenu((p) => !p);
    }
  };

  const removeEntityFromTBPTable = (entity) => {
    if (isArray(entity) && isEmpty(entity)) {
      handleTBPEntities([]);
      return;
    }
    const parentEntity = TBPEntities.find(({ key }) => key === entity.entitiesTypeKey);
    if (parentEntity.items.length < 2) {
      handleTBPEntities((prev) => prev.filter((et) => et.key !== parentEntity.key));
    } else {
      handleTBPEntities((prev) => {
        return prev.map((et) => {
          if (et.key === parentEntity.key)
            return { ...et, items: et.items.filter((e) => e.key !== entity.key) };
          return et;
        });
      });
    }
  };
  /**
   * this function add entity type to TBPEntites state with the selected entity
   * @param {object} entity - item of entity type
   */
  const addEntityToTBPTable = (entity) => {
    // const draggedEntity = entitiesTypesInstances[source.index]
    const parentEntity = TBPEntities.find(({ key }) => key === entity.entitiesTypeKey);
    if (parentEntity) {
      handleTBPEntities((prev) =>
        prev.map((entityType) => {
          if (entityType.key === parentEntity.key) {
            return { ...parentEntity, items: [...parentEntity.items, entity] };
          }
          return entityType;
        })
      );
    } else {
      const _parentEntity = entitiesTypes.find(({ key }) => key === entity.entitiesTypeKey);
      handleTBPEntities((prev) => [
        ...prev,
        {
          ..._parentEntity,
          items: [entity],
        },
      ]);
    }
  };

  const addEntityToTBPTableFromDnD = (entity) => {
    addEntityToTBPTable(entity);
    setEntitiesTypesInstances((p) => p.filter(({ key }) => key !== entity.key));
  };

  const handleTBPEntities = (tbpEntities) => {
    setTBPEntities(tbpEntities);
  };

  const cleanTBPTable = () => {
    setTBPEntities([]);
    setTPEntities([]);
    setEntitiesTypesInstances(entities.reduce((prev, curr) => [...prev, ...curr.items], []));
    setSelectedType(
      entities.reduce((prev, entityType) => ({ ...prev, [entityType.name]: true }), {})
    );
    if (addEntityMode !== INIT_MODE) setEntitiesTypes(JSON.parse(JSON.stringify(entities)));
  };

  // to positions entities, selected to position after TBPEntities
  const handleTPEntities = (entity) => {
    TPEntities.find((e) => e.key === entity.key)
      ? setTPEntities((p) => p.filter((v) => v.key !== entity.key))
      : setTPEntities((p) => [...p, entity]);
  };
  /**
   *
   * @param {string} type - the name of parent entity type
   * @param {array} indices - array of indexes sorted, those indexes points to selected entities in specific entity type
   * @param {number[][]} newLocations - array of arrays, each array holds 2 values as with type number. Points on new location of selected entities
   * @returns
   */

  const changeLocations = (
    type,
    indices,
    newLocations = [undefined],
    groupKey,
    _entitiesTypes = entitiesTypes
  ) => {
    // deep copy of entities
    let tempEntities = JSON.parse(JSON.stringify(_entitiesTypes));
    // shallow copy of object in tempEntities (the d copy of entities)
    let typeEntities = tempEntities.find((d) => d.name === type);
    for (let i = 0; i < indices.length; ++i) {
      const loc = newLocations[Math.min(i, newLocations.length - 1)];
      changeEntityLocation(
        typeEntities.items[indices[i]],
        typeEntities,
        loc,
        layerChosen,
        groupKey
      );
    }
    return tempEntities;
  };

  const handleMapClick = (e) => {
    setToggleMenu(false);
    if ((shape === 'Point' || shape === 'Free') && TPEntities.length < 1) return;

    const currPoint = [e.latlng.lat, e.latlng.lng];
    if (shape === 'Point' || shape === 'Free') {
      let _selection = [];
      let entityType = null;
      let groupKey = null;
      if (TPEntities.length > 1) {
        groupKey = uuid();
      }
      for (let i = 0; i < TPEntities.length; i++) {
        const entity = TPEntities[i];
        entityType = findEntityTypeName(entity.entitiesTypeKey);
        _selection.push(entityType.items.findIndex((e) => e.key === entity.key));
      }
      setEntitiesTypes(changeLocations(entityType.name, _selection.sort(), [currPoint], groupKey));
      setTPEntities([]);
      setMarkedPoints([]);
      setSelection([]);
    } else {
      setMarkedPoints(markedPoints.concat([currPoint]));
    }
  };

  const deviceLocationRemove = (dev) => {
    return () => {
      if (TBPEntities.length < 2) {
        setAddEntityMode(INIT_MODE);
        cleanTBPTable();
      }
      const parentEntity = findEntityTypeName(dev.entitiesTypeKey);
      const childIndex = parentEntity.items.findIndex(({ key }) => key === dev.key);
      if (addEntityMode !== INIT_MODE) {
        setEntitiesTypes(changeLocations(parentEntity.name, [childIndex]));
      } else {
        setEntities(changeLocations(parentEntity.name, [childIndex]));
      }
    }
  }

  const deviceLocationEdit = (dev) => {
    return () => {
      addEntityToTBPTable(dev);
      if (TBPEntities.length < 1) setAddEntityMode(EDIT_MODE);
    }
  }

  function findIndexOfEntity(entity, parentEntity) {
    return parentEntity.items.findIndex((e) => e.key === entity.key);
  }

  const handlePutEntitiesOnPrev = () => {
    if (TPEntities.length > 0) {
      const positions = shapeToPositions(markedPoints, TPEntities.length);
      const entities = [];
      for (let e of TPEntities) {
        const parentEntity = findEntityTypeName(e.entitiesTypeKey);
        const parentEntityIndex = entities.findIndex(
          (entity) => entity.parentEntity.name === parentEntity.name
        );
        if (parentEntityIndex > -1) {
          entities[parentEntityIndex].indices.push(findIndexOfEntity(e, parentEntity));
        } else {
          const entity = { parentEntity, indices: [], positions: [] };
          entity.indices.push(findIndexOfEntity(e, parentEntity));
          entities.push(entity);
        }
      }
      for (let entity of entities) {
        const num = entity.indices.length;
        entity.positions = positions.slice(0, num);
        positions.splice(0, num);
      }
      let newEntitiesTypes = entitiesTypes;
      for (let entity of entities) {
        newEntitiesTypes = changeLocations(
          entity.parentEntity.name,
          entity.indices.sort(),
          entity.positions,
          newEntitiesTypes
        );
      }
      setEntitiesTypes(newEntitiesTypes);
    }
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
    const row = (experimentDataMaps || []).find((r) => r.imageName === layerChosen);
    return row ? !row.embedded : false;
  };

  return (
    <Grid
      container
      direction="row-reverse"
      justifyContent="flex-start"
      alignItems="stretch"
      style={{ height: '550px' }}>
      <Grid item xs={9}>
        <EntityMap
          onClick={handleMapClick}
          experimentDataMaps={experimentDataMaps}
          layerChosen={layerChosen}
          setLayerChosen={setLayerChosen}
          showGrid={showGrid}
          showGridMeters={showGridMeters}>
          {(filteredEntities.length > 0 ? filteredEntities : entitiesTypes).map((devType) => {
            if (selectedType[devType.name]) {
              const tbpParent = TBPEntities.find(({ key }) => devType.key === key) || null;
              return devType.items.map((dev, index) => {
                const loc = getEntityLocation(dev, devType, layerChosen);
                if (!loc) return null;
                const isOnEdit =
                  isObject(tbpParent) &&
                  tbpParent.items.findIndex(({ key }) => dev.key === key) !== -1;
                return (
                  <>
                    <EntityMarker
                      key={dev.key}
                      entity={dev}
                      entityType={devType}
                      devLocation={loc}
                      isSelected={selection.includes(index)}
                      isTypeSelected={devType.name === selectedType}
                      isOnEdit={isOnEdit}
                      shouldShowName={showName}
                      handleMarkerClick={handleMarkerClick}
                      onContextMenu={handleContextMenuClick}
                    />

                    {toggleMenu && (
                      <MarkContextmenu
                        position={{ y: anchorPoint.y, x: anchorPoint.x }}
                        deviceLocationEdit={deviceLocationEdit(dev)}
                        deviceLocationRemove={deviceLocationRemove(dev)}
                        isShow={loc[0] === anchorPoint.mapX && loc[1] === anchorPoint.mapY}
                        onClose={() => setToggleMenu(false)}
                      />
                    )}
                  </>
                );
              });
            } else {
              return null;
            }
          })}

          <MarkedShape
            markedPoints={markedPoints}
            setMarkedPoints={setMarkedPoints}
            shape={shape}
            shapeToLine={shapeToLine}
            shapeToPositions={shapeToPositions}
            entityNum={selection.length}
            distanceInMeters={distanceInMeters()}
          />
        </EntityMap>
      </Grid>
      {/* To be position Table */}
      <Grid item xs={3} style={{ overflow: 'inherit', backgroundColor: '#f5f5f5' }}>
        <Container disableGutters className={classes.container}>
          <MapTypesList layerChosen={layerChosen} handleMapTypeChange={handleMapTypeChange} />

          <WidthDivider />

          <EntityTypeFilter
            classes={classes}
            handleFilterDevices={handleFilterDevices}
            entitiesNames={entitiesTypes.map((device) => device.name)}
            filteredEntities={filteredEntities}
            isFiltered={isFiltered}
          />

          <WidthDivider />

          <SearchInput onSearch={handleSearchEntities} />

          <WidthDivider />

          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <Box overflow="auto" bgcolor="inherit" maxHeight={250} minHeight={200}>
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

              {entitiesTypes.length > 0 ? (
                (filteredEntities.length > 0 ? filteredEntities : entitiesTypes).map((entity) => (
                  <DeviceRow key={entity.key} entity={entity} onClick={handleShowEntitiesOnMap} />
                ))
              ) : (
                <p> No entities to show</p>
              )}
            </Box>

            <Box width="100%" bgcolor="inherit">
              <TBPButtons
                addEntityMode={addEntityMode}
                handleModeChange={handleModeChange}
                setShowName={setShowName}
                onCancel={() => cleanTBPTable()}
                onSubmit={() => handlePutEntities()}
              />
            </Box>
            {addEntityMode === SELECT_MODE && (
              <EntitiesTypesTable
                classes={classes}
                entities={entitiesTypes}
                entitiesTypesInstances={entitiesTypesInstances}
                setAddEntityMode={setAddEntityMode}
                addEntityToTBPTableFromDnD={addEntityToTBPTableFromDnD}
                removeEntityLocation={(entityTypeName, indices) =>
                  setEntities(changeLocations(entityTypeName, indices))
                }
              />
            )}
            {addEntityMode === EDIT_MODE && (
              <EditTable
                TBPEntities={TBPEntities}
                removeEntityFromTBPTable={removeEntityFromTBPTable}
                onShapeChange={(v) => setShape(v)}
                onSingleShapeSubmit={handleMapClick}
                handlePutEntitiesOnPrev={handlePutEntitiesOnPrev}
                markedPoints={markedPoints}
              />
            )}
          </DragDropContext>
        </Container>
      </Grid>
    </Grid>
  );
};
