import React, { useState } from 'react'

import Box from '@material-ui/core/Box'
import { Divider, IconButton, Popper, Typography } from '@material-ui/core'
import { icons } from './utils'
import {
  ONCLICK_MODE,
  DOT_MODE,
  CURVE_MODE,
  LINE_MODE,
  RECTANGLE_MODE,
  MATRIX_MODE,
  CLONE_MODE,
  EDIT_ENTITY_MODE
} from '../utils/constants'
import classnames from 'classnames';

const PopperBox = ({ value, children }) => {
  return (
    <Box sx={{ position: 'absolute', top: 0, left: '100%' }}>
      {children}
    </Box>
  )
}

function EditTable({ classes }) {
  const [editTableMode, setEditTableMode] = useState('')

  const handleClick = (value) => {
    setEditTableMode(value !== editTableMode ? value : '')
  }

  return (
    <Box className={classnames(classes.root, classes.editTable)}>
      <Typography variant="overline">
        tools
      </Typography>

      {
        icons.map(({ icon, value, component }) => (
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <IconButton key={value} onClick={() => handleClick(value)}>{icon}</IconButton>
            {editTableMode === value &&
              <PopperBox
                value={value}
                children={
                  React.cloneElement(component, { text: 'gell!' })
                } />
            }
            {value === 'matrix' && <Divider variant="middle" light />}
          </div>

        ))
      }

    </Box >
  )
}

export default EditTable