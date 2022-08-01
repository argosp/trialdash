import React, { useState } from 'react'

import Box from '@material-ui/core/Box'
import { Divider, Grid, IconButton, Typography } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { icons } from './utils'

import classnames from 'classnames';
import { makeStyles } from "@material-ui/core/styles";
import { styles } from './styles'
import classNames from 'classnames';


const useStyles = makeStyles(styles);


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

function EditTable({ TBPEntities }) {
  const [editTableMode, setEditTableMode] = useState('')
  const classes = useStyles();

  const handleClick = (value) => {
    setEditTableMode(value !== editTableMode ? value : '')
  }

  const onSubmit = () => {

  }

  return (
    <Box className={classnames(classes.root, classes.editTable)}>
      <Typography variant="overline" align="center">
        tools
      </Typography>

      {
        icons.map(({ icon, value, component }) => {
          const iconStyle = editTableMode === value ? classes.activeButton : null;
          const iconButtonStyle = (editTableMode !== '' && editTableMode !== value) ? classes.notActiveButton : null;
          return (
            <div style={{ position: 'relative', textAlign: 'center' }} className={iconStyle}>
              <IconButton key={value} onClick={() => handleClick(value)} className={iconButtonStyle}>{icon}</IconButton>
              {editTableMode === value &&
                <PopperBox
                  title={value}
                  handleClick={handleClick}
                  classes={classes}
                  children={
                    React.cloneElement(component, { classes, onSubmit, TBPEntities })
                  } />
              }
              {value === 'matrix' && <Divider variant="middle" light />}
            </div>

          )
        })
      }

    </Box >
  )
}

export default EditTable