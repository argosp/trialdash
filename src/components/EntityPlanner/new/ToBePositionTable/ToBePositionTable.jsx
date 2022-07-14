import React, { useState } from 'react'
import { makeStyles } from "@material-ui/core/styles";
import { Box, Container, Divider, Button } from '@material-ui/core'
import MapTypesList from './MapTypesList'
import DevicesFilter from './DevicesFilter';
import SearchInput from './SearchInput';
import DeviceRow from './DeviceRow';
import AddDeviceButton from './AddDeviceButton'

import DeviceTypesTable from './DeviceTypes'

const WidthDivider = () => <Divider light style={{position: 'absolute', left: 0, width: '100%'}} />

const styles = (theme) => ({
  container:{
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    position: 'relative',
    padding: 10,
    "& .tbpRow":{
      padding: "10px 0"
    }
  },
  buttons:{
    container:{position: 'absolute', width: '100%', p: '10px', backgroundColor: 'inherit'},
    primaryButton:{

    },
    secondaryButton:{

    }
  },
  containerChild:{
    padding: '10px 0'
  }
})

const useStyles = makeStyles(styles);

function ToBePositionTable({entities}) {

  const classes = useStyles();

  const [ mapType, setMapType ] = useState("concourse");
  const [ addDeviceMode , setAddDeviceMode ] = useState(false)
  const [ filteredDevices, setFilteredDevices ] = useState([]);

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

      <WidthDivider/>

      <DevicesFilter />

      <WidthDivider/>

      <SearchInput  />

      <WidthDivider/>

    <Box overflow='auto' bgcolor='inherit' maxHeight={250} >

      {
        entities.length > 0 ?
        entities.map((entity) => {
        return (<>
        {
          /**
           * dragMode && <DragAndDropComponent />
           */
        }
        <DeviceRow entity={entity} />
        </>)
        
      })
      :
      <p> No entities to show</p>
      
    }

    </Box>

    <Box sx={{ width: '100%'}} bgcolor='inherit' >
      {!!addDeviceMode? 
      <>
      <Button 
        variant='contained'
        color='primary'
        style={{width: '100%', marginBottom: '10px'}}
        onClick={() => setAddDeviceMode(false)}>
        continue
      </Button>
      
      <Button
        variant='outlined'
        color='gray'
        style={{width: '100%'}}
        onClick={() => setAddDeviceMode(false)}>
       cancel
      </Button>
      </>
      :
      <>
        <label>
        <input type="checkbox"/>
        Entities show name
        </label>
      <Button
      variant='contained'
      color='primary'
      style={{width: '100%'}}
      onClick={() => setAddDeviceMode(true)}
      >
      add device
      </Button>
     </>
    }
    </Box>


    {/* {
      !!addDeviceMode && <DeviceTypesTable setAddDeviceMode={setAddDeviceMode} />
    } */}
    
    </Container>
    </>
  )
}

export default ToBePositionTable