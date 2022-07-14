import React from 'react'
import { Typography,Box, Button } from '@material-ui/core'
import {ReactComponent as FilterIcon} from './Vector.svg'

const DevicesFilter = () => {

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" className="tbpRow">
    <Typography component="span">
        <Box component="span" sx={{ fontWeight: 600}}>Devices</Box>
    </Typography>

    <Button
    style={{textTransform: 'none'}}
    startIcon={<FilterIcon height={20} width={20} />}
    >
        <Typography component="span">Filter</Typography>
    </Button>


      </Box>
  )
}

export default DevicesFilter