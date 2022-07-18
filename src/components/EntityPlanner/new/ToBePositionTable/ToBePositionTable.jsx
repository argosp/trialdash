import React, { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';


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

const useStyles = makeStyles(styles);

const WidthDivider = () => <Divider light style={{ position: 'absolute', left: 0, width: '100%' }} />

function ToBePositionTable({ entities }) {

  const classes = useStyles();

  const [mapType, setMapType] = useState("concourse");
  const [addDeviceMode, setAddDeviceMode] = useState(false)
  const [filteredDevices, setFilteredDevices] = useState([]);

  const handleMapTypeChange = (value) => {
    setMapType(value)
  }

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

        
          <Box overflow='auto' bgcolor='inherit' maxHeight={250} >


            


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

       
      </Container>
    </>
  )
}

export default ToBePositionTable