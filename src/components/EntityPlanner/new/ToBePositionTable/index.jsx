import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import uuid from 'uuid/v4';

import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

import MapTypesList from './MapTypesList'
import EntityTypeFilter from './EntityTypeFilter';
import SearchInput from './SearchInput';
import DeviceRow from './EntityTypeRow';
import EntitiesTypesTable from './EntitiesTypesTable';
import TBPEntity from './TBPEntity'
import TBPButtons from './TBPButtons'
import { ReactComponent as DnDIcon } from './DnDIcon.svg';

import { makeStyles } from "@material-ui/core/styles";
import { styles } from './styles'
import { styles as dndStyles } from '../../../AddSetForm/styles'
import {
  INIT_MODE,
  SELECT_MODE,
  EDIT_MODE,
  LOCATIONS_MODE
} from './utils/constants'

const useStyles = makeStyles(styles);
const useDNDStyles = makeStyles(dndStyles);


const WidthDivider = () => <Divider light style={{ position: 'absolute', left: 0, width: '100%' }} />

function ToBePositionTable({ entities }) {

  const classes = useStyles();
  const dndClasses = useDNDStyles();

  const [dropZoneClassName, setDropZoneClassName] = useState(classnames(dndClasses.dropZone))
  const [mapType, setMapType] = useState("concourse");
  const [addEntityMode, setAddEntityMode] = useState(INIT_MODE)
  const [isDragging, setIsDragging] = useState(false)
  const [TBPEntities, setTBPEntities] = useState([]);
  const [filteredTBPEntities, setFilteredTBPEntities] = useState([]);
  const [entitiesTypesInstances, setEntitiesTypesInstances] = useState([])

  useEffect(() => setEntitiesTypesInstances(entities.reduce((prev, curr) => [...prev, ...curr.items], [])), [entities])

  const handleFilterDevices = (filter) => {
    console.log(filter)
    // setFilteredTBPEntities(filter)
  }

  const handleMapTypeChange = (value) => {
    setMapType(value)
  }

  const handleModeChange = (mode) => {

    if (mode === EDIT_MODE && TBPEntities.length < 1) {
      alert('No entities to position!')
      return
    }
    if (mode === INIT_MODE && TBPEntities.length > 0) {
      if (!window.confirm('This action will cancel all the process so far. Continue?'))
        return
      setTBPEntities([]);
    }
    setAddEntityMode(mode)

  }

  const findEntityTypeName = (key) => entities.find(e => e.key === key)

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = ({ source, destination }) => {
    setIsDragging(false);

    const draggedEntity = entitiesTypesInstances[source.index]
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      setTBPEntities(prev => ([
        ...prev,
        draggedEntity
      ]));
      setEntitiesTypesInstances(p => p.filter(({ key }) => key !== draggedEntity.key))
    }
  };
  useEffect(() => {

    if (isEmpty(TBPEntities) && isDragging) {
      setDropZoneClassName(classnames(dndClasses.dropZoneEmpty, dndClasses.dropZoneEmptyDragging))
    }

    if (isEmpty(TBPEntities) && !isDragging) {
      setDropZoneClassName(classnames(dndClasses.dropZoneEmpty))
    }
  }, [isDragging])



  return (
    <>
      <Container disableGutters className={classes.container}>

        <MapTypesList
          mapType={mapType}
          handleMapTypeChange={handleMapTypeChange}

        />

        <WidthDivider />

        <EntityTypeFilter classes={classes} entitiesNames={entities.map(device => device.name)} handleFilterDevices={handleFilterDevices} />

        <WidthDivider />

        <SearchInput />

        <WidthDivider />

        <DragDropContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <Box overflow='auto' bgcolor='inherit' maxHeight={250} >


            {
              addEntityMode === SELECT_MODE &&
              <Droppable droppableId="edit-table-droppable">
                {droppableProvided => (
                  <div
                    ref={droppableProvided.innerRef}
                    className={dropZoneClassName}
                    style={{
                      display: 'flex',
                      justifyContent: isEmpty(TBPEntities) ? 'center' : 'start',
                      alignItems: 'center',
                      margin: '8px auto',
                      width: '99%',
                      lineHeight: '10px',
                      flexDirection: 'column'
                    }}
                  >
                    {
                      isEmpty(TBPEntities) ?
                        <>
                          <DnDIcon />
                          <p>
                            Drag Devices Here
                          </p>
                        </>
                        :

                        TBPEntities.map((entity, index) => (
                          <Draggable
                            key={entity.key}
                            draggableId={entity.key}
                            index={index}
                          // isDragDisabled={isDragDisabled}
                          >
                            {draggableProvided => (
                              <div
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.draggableProps}
                                {...draggableProvided.dragHandleProps}
                                style={{ width: '100%' }}
                              >
                                <TBPEntity
                                  entity={entity}
                                  entityType={findEntityTypeName(entity.entitiesTypeKey)}
                                  classes={classes.tbpEntity}
                                />
                              </div>
                            )}
                          </Draggable>
                        )
                        )

                    }
                    {droppableProvided.placeholder}
                  </div>)}
              </Droppable>
            }

            {
              entities.length > 0 ?
                entities.map((entity) => <DeviceRow key={entity.key} entity={entity} />)
                :
                <p> No entities to show</p>

            }

          </Box>

          <Box sx={{ width: '100%' }} bgcolor='inherit' >
            <TBPButtons addEntityMode={addEntityMode} handleModeChange={handleModeChange} />
          </Box>


          {
            addEntityMode === SELECT_MODE &&
            <EntitiesTypesTable
              entities={entities}
              entitiesTypesInstances={entitiesTypesInstances}
              setAddEntityMode={setAddEntityMode}

            />
          }

        </DragDropContext>
      </Container>
    </>
  )
}

export default ToBePositionTable