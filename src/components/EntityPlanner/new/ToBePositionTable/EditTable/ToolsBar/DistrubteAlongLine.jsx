import { Box, Button, Grid, TextField, Typography } from '@material-ui/core'
import React from 'react'

const DistributeAlongLine = ({ toolClasses, onSubmit }) => {

  const mock = { x: 23.34546, y: 45.34342 }
  return (
    <Grid container className={toolClasses.tool}>
      <Grid item className="toolItem">
        <TextField id="x-input" label="x" defaultValue={mock.x} InputLabelProps={{ shrink: true }} />
        <TextField id="y-input" label="y" defaultValue={mock.y} InputLabelProps={{ shrink: true }} />
      </Grid>

      <Button className="button" variant="outlined" color="primary" onClick={onSubmit} >
        distribute
      </Button>
    </Grid>
  )
}

export default DistributeAlongLine