import React, { useState } from 'react'

import Box from '@material-ui/core/Box'
import { Divider, IconButton, Typography } from '@material-ui/core'
import { icons } from './utils'

import classnames from 'classnames';



function EditTable({ classes }) {
  const [editTableMode, setEditTableMode] = useState('')

  return (
    <Box className={classnames(classes.root, classes.editTable)} >
      <Typography variant="overline">
        tools
      </Typography>

      {
        icons.map(({ icon, value }) => (
          <>
            <IconButton key={value}>{icon}</IconButton>
            {value === 'matrix' && <Divider variant="middle" light />}
          </>

        ))
      }

    </Box >
  )
}

export default EditTable