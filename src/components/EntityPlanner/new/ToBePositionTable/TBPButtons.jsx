import React from 'react'
import { Box, Button, ButtonGroup } from '@material-ui/core'
import {
  INIT_MODE,
  SELECT_MODE,
  EDIT_MODE,
  LOCATIONS_MODE
} from './utils/constants'

const TBPButtons = ({ addEntityMode, handleModeChange }) => {


  const ModeButton = ({ text, mode, variant, color, bottom }) => {
    console.log(mode)
    return (
      <Button
        variant={variant ? 'contained' : 'outlined'}
        color={color ? 'primary' : 'gray'}
        style={{
          width: '100%',
          marginBottom: bottom ? '10px' : 'none'
        }}
        onClick={() => handleModeChange(mode)}
      >
        {text}
      </Button>
    )
  }



  if (addEntityMode === EDIT_MODE)
    return (
      <>
        <ModeButton
          variant
          color
          bottom
          mode={LOCATIONS_MODE}
          text='save locations'
        />

        <ModeButton
          mode={INIT_MODE}
          text='cancel'
        />
      </>

    )
  if (addEntityMode === SELECT_MODE)
    return (
      <>
        <ModeButton
          variant
          color
          bottom
          mode={EDIT_MODE}
          text='continue'
        />
        <ModeButton
          mode={INIT_MODE}
          text='cancel'
        />
      </>
    )

  return (
    <>
      <label>
        <input type="checkbox" />
        Entities show name
      </label>
      <ModeButton
        variant
        color
        mode={SELECT_MODE}
        text='add entity'
      />
    </>
  )
}

export default TBPButtons;