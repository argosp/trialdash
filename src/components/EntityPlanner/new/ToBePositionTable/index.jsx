import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';

import EntitiesTypesTable from './EntitiesTypesTable';
import EditTable from './EditTable';
import MapTypesList from './MapTypesList';
import EntityTypeFilter from './EntityTypeFilter';
import SearchInput from './SearchInput';
import DeviceRow from './EntityTypeRow';
import TBPButtons from './TBPButtons';
import DnDEntityZone from './DnDEntityZone';

import { makeStyles } from '@material-ui/core/styles';
import { styles } from './styles';

import { INIT_MODE, SELECT_MODE, EDIT_MODE, LOCATIONS_MODE } from './utils/constants';

const useStyles = makeStyles(styles);

const WidthDivider = () => (
  <Divider light style={{ position: 'absolute', left: 0, width: '100%' }} />
);

function ToBePositionTable({
  entities,
  TBPEntities,
  removeEntityFromTBPTable,
  selectedType,
  setSelectedType,
  addEntityMode,
  setAddEntityMode,
  addEntityToTBPTable,
}) {
  const classes = useStyles();

  const [mapType, setMapType] = useState('concourse');
  // const [addEntityMode, setAddEntityMode] = useState(INIT_MODE)
  const [isDragging, setIsDragging] = useState(false);
  // const [TBPEntities, setTBPEntities] = useState([]);
  const [filteredTBPEntities, setFilteredTBPEntities] = useState([]);
  // entitiesTypesInstances => each entity type items, sorted by index for DnD implementation
  const [entitiesTypesInstances, setEntitiesTypesInstances] = useState([]);
  useEffect(
    () => setEntitiesTypesInstances(entities.reduce((prev, curr) => [...prev, ...curr.items], [])),
    [entities]
  );

  const handleFilterDevices = (filter) => {
    console.log(filter);
    // setFilteredTBPEntities(filter)
  };

  const handleMapTypeChange = (value) => {
    setMapType(value);
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

  const findEntityTypeName = (key) => entities.find((e) => e.key === key);

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
      const draggedEntity = entitiesTypesInstances[source.index];
      addEntityToTBPTable(draggedEntity);
      setEntitiesTypesInstances((p) => p.filter(({ key }) => key !== draggedEntity.key));
    }
  };

  useEffect(() => console.log(TBPEntities), [TBPEntities]);

  return (
    <>
      <Container disableGutters className={classes.container}>
        <MapTypesList mapType={mapType} handleMapTypeChange={handleMapTypeChange} />

        <WidthDivider />

        <EntityTypeFilter
          classes={classes}
          handleFilterDevices={handleFilterDevices}
          entitiesNames={entities.map((device) => device.name)}
        />

        <WidthDivider />

        <SearchInput />

        <WidthDivider />

        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Box overflow="auto" bgcolor="inherit" maxHeight={250}>
            {
              <DnDEntityZone
                addEntityMode={addEntityMode}
                TBPEntities={TBPEntities}
                isDragging={isDragging}
                findEntityTypeName={findEntityTypeName}
              />
            }

            {entities.length > 0 ? (
              entities.map((entity) => (
                <DeviceRow key={entity.key} entity={entity} onClick={handleShowEntitiesOnMap} />
              ))
            ) : (
              <p> No entities to show</p>
            )}
          </Box>

          <Box width="100%" bgcolor="inherit">
            <TBPButtons addEntityMode={addEntityMode} handleModeChange={handleModeChange} />
          </Box>

          {addEntityMode === SELECT_MODE && (
            <EntitiesTypesTable
              classes={classes}
              entities={entities}
              entitiesTypesInstances={entitiesTypesInstances}
              setAddEntityMode={setAddEntityMode}
            />
          )}

          {addEntityMode === EDIT_MODE && (
            <EditTable
              TBPEntities={TBPEntities}
              removeEntityFromTBPTable={removeEntityFromTBPTable}
            />
          )}
        </DragDropContext>
      </Container>
    </>
  );
}

export default ToBePositionTable;
