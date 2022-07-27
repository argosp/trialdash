import React from 'react'
import { Button, Grid, TextField } from '@material-ui/core'


const FreePositioning = ({ classes, onSubmit }) => {
  const mock = { x: 23.34546, y: 45.34342 }
  return (
    <Grid container className={classes.tool}>
      <Grid item className="toolItem">
        <TextField id="x-input" label="x" defaultValue={mock.x} InputLabelProps={{ shrink: true }} />
        <TextField id="y-input" label="y" defaultValue={mock.y} InputLabelProps={{ shrink: true }} />
      </Grid>
    </Grid>
  )
}

export default FreePositioning