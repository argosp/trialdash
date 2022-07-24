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
import EntitiesTypesTable from './EntitiesTypesTable'
import { ReactComponent as DnDIcon } from './DnDIcon.svg';

import { makeStyles } from "@material-ui/core/styles";
import { styles } from './styles'
import { styles as dndStyles } from '../../../AddSetForm/styles'

const useStyles = makeStyles(styles);
const useDNDStyles = makeStyles(dndStyles);

const WidthDivider = () => <Divider light style={{ position: 'absolute', left: 0, width: '100%' }} />

function ToBePositionTable({ entities }) {

  const classes = useStyles();
  const dndClasses = useDNDStyles();

  const [dropZoneClassName, setDropZoneClassName] = useState(classnames(dndClasses.dropZone))
  const [mapType, setMapType] = useState("concourse");
  const [addDeviceMode, setAddDeviceMode] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [TBPEntities, setTBPEntities] = useState([]);
  const [filteredTBPEntities, setFilteredTBPEntities] = useState([]);
  const entitiesTypesInstances = entities.reduce((prev, curr) => [...prev, ...curr.items], [])

  const handleFilterDevices = (filter) => {
    console.log(filter)
    // setFilteredTBPEntities(filter)
  }

  const handleMapTypeChange = (value) => {
    setMapType(value)
  }

  const reorderDraggedFieldTypes = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const moveFieldType = (source, destination, droppableSource, droppableDestination) => {
    console.log("moveFieldType:", { source, destination })
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const fieldType = sourceClone[droppableSource.index];

    destClone.splice(droppableDestination.index, 0, {
      ...fieldType,
      key: uuid(),
    });

    return destClone;
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = ({ source, destination }) => {
    setIsDragging(false);
    console.log("onDragEnd:", { source, destination });
    const draggedEntity = entitiesTypesInstances[source.index]
    // dropped outside the list
    if (!destination) {
      return;
    }
    // setTBPEntities(p => ([...p, { source }]))

    if (source.droppableId !== destination.droppableId) {
      setTBPEntities(prev => ([
        ...prev,
        draggedEntity
      ]));
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
              !!addDeviceMode &&
              <Droppable droppableId="edit-table-droppable">
                {droppableProvided => (
                  <div
                    ref={droppableProvided.innerRef}
                    className={dropZoneClassName}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
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
                              >
                                <div style={{ width: 50, height: 50, border: '1px solid black' }}>
                                  {entity.name}
                                </div>
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
            {
              !!addDeviceMode ?
                <>
                  <Button
                    variant='contained'
                    color='primary'
                    style={{ width: '100%', marginBottom: '10px' }}
                    onClick={() => setAddDeviceMode(false)}>
                    continue
                  </Button>

                  <Button
                    variant='outlined'
                    color='gray'
                    style={{ width: '100%' }}
                    onClick={() => setAddDeviceMode(false)}>
                    cancel
                  </Button>
                </>
                :
                <>
                  <label>
                    <input type="checkbox" />
                    Entities show name
                  </label>
                  <Button
                    variant='contained'
                    color='primary'
                    style={{ width: '100%' }}
                    onClick={() => setAddDeviceMode(true)}
                  >
                    add device
                  </Button>
                </>
            }
          </Box>


          {
            !!addDeviceMode &&
            <EntitiesTypesTable
              entities={entities}
              entitiesTypesInstances={entitiesTypesInstances}
              setAddDeviceMode={setAddDeviceMode}

            />
          }

        </DragDropContext>
      </Container>
    </>
  )
}

export default ToBePositionTable