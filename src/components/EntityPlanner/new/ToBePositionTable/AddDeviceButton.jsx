import React from 'react'
import { Box, Button } from '@material-ui/core'

const ButtonWrapper = ({children}) => {
  return(
    <Box>
      {children}
    </Box>
  )
}


const AddDeviceButton = () => {



  return (
    <div style={{position: 'absolute', width: '100%'}}>
      <label>
      <input type="checkbox"/>
      Entities show name
      </label>
    <Button
    variant='contained'
    color='primary'
    style={{width: '100%'}}
    >
    Add Device
    </Button>
    </div>
  )
}

export default AddDeviceButton;