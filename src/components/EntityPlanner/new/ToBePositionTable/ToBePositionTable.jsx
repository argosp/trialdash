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
import DevicesFilter from './DevicesFilter';
import SearchInput from './SearchInput';
import DeviceRow from './DeviceRow';
import EditTable from './EditTable'

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
  const [TBPDevices, setTBPDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);

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
    // dropped outside the list
    if (!destination) {
      return;
    }
    setTBPDevices(p => ([...p, { source }]))

    // if (source.droppableId === destination.droppableId) {
    //   setTBPDevices(prev => ({
    //     ...prev,
    //     properties: reorderDraggedFieldTypes(
    //       prev.properties,
    //       source.index,
    //       destination.index,
    //     ),
    //   }));
    // } else {
    //   setTBPDevices(prev => ({
    //     ...prev,
    //     properties: moveFieldType(
    //       prev.fieldTypes,
    //       prev.properties,
    //       source,
    //       destination,
    //     )
    //   }));
    // }
  };
  useEffect(() => {

    if (isEmpty(TBPDevices) && isDragging) {
      setDropZoneClassName(classnames(dndClasses.dropZoneEmpty, dndClasses.dropZoneEmptyDragging))
    }

    if (isEmpty(TBPDevices) && !isDragging) {
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

        <DevicesFilter />

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
                  >
                    {
                      isEmpty(TBPDevices) ?
                        <span>Drag Devices Here</span>
                        :

                        TBPDevices.map((fieldType, index) => {
                          console.log(fieldType)
                          return (
                            <Draggable
                              key={fieldType.source.droppableId + index}
                              draggableId={fieldType.source.droppableId + index}
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

                                  </div>
                                </div>
                              )}
                            </Draggable>
                          )
                        })

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
            <EditTable
              entities={entities}
              setAddDeviceMode={setAddDeviceMode}

            />
          }

        </DragDropContext>
      </Container>
    </>
  )
}

export default ToBePositionTable