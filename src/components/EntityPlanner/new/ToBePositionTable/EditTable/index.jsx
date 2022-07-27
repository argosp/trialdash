import React, { useState } from 'react'

import Box from '@material-ui/core/Box'
import { Divider, Grid, IconButton, Typography } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { icons } from './utils'

import classnames from 'classnames';

const PopperBox = ({ title, handleClick, classes, children }) => {

  return (
    <Box sx={{ position: 'absolute', top: 0, left: '100%' }}>
      <Grid container className={classes.toolBoxContainer} >
        <Grid item className={classes.toolBoxItem} >
          <IconButton onClick={() => handleClick(title)} children={<ChevronLeftIcon />} />
          <Typography component="span" children={<Box sx={{ fontWeight: '700' }}>{title}</Box>} />
        </Grid>
        <Grid item>
          {children}
        </Grid>
      </Grid>
    </Box>
  )
}

function EditTable({ classes }) {
  const [editTableMode, setEditTableMode] = useState('')

  const handleClick = (value) => {
    setEditTableMode(value !== editTableMode ? value : '')
  }

  const onSubmit = () => {

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
                title={value}
                handleClick={handleClick}
                classes={classes}
                children={
                  React.cloneElement(component, { toolClasses: classes, onSubmit })
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