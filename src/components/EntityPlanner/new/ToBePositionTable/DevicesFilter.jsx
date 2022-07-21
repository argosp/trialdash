import React, { useEffect, useState } from 'react'
import { findLastIndex, fromPairs } from 'lodash'
import { Typography, Box, Button, Checkbox, FormControl, FormLabel, FormGroup, FormControlLabel, IconButton } from '@material-ui/core'
import { ReactComponent as FilterIcon } from './FilterIcon.svg'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { withStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import DoneOutlinedIcon from '@material-ui/icons/DoneOutlined';



const DevicesFilter = ({ classes, deviceNames, handleFilterDevices }) => {

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [checked, setChecked] = useState(fromPairs(deviceNames.map((name) => [name, false])))

  const handleChange = (e, val) => {
    console.log(val);
    const filter = e.target.name
    const v = e.target.checked
    console.log(filter, v);
    setChecked(p => ({ ...p, [filter]: v }))
    handleFilterDevices({ ...checked, [filter]: v })
  }

  // const StyledCheckbox = ({ deviceName, handleChange, isClicked }) => (
  //   <div style={{ width: 16, height: 16, border: '0.666667px solid #E0E0E0', display: 'inline' }}>
  //     <input style={{ display: 'none' }} type="checkbox" name={deviceName} onChange={handleChange} />
  //     {isClicked && <span style={{ zIndex: 10, display: 'flex', alignItems: 'center' }}>
  //       <DoneOutlinedIcon style={{ fontSize: 14 }} />
  //     </span>
  //     }
  //   </div>
  // )


  useEffect(() => console.log(checked), [checked])

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" className="tbpRow">
      <Typography component="span">
        <Box component="span" sx={{ fontWeight: 600 }}>Devices</Box>
      </Typography>

      <Button
        // style={{ textTransform: 'none' }}
        startIcon={<FilterIcon height={20} width={20} />}
        onClick={() => setIsFilterOpen(p => !p)}
      >
        <Typography component="span">Filter</Typography>
      </Button>
      {
        isFilterOpen &&
        <Box className={classes.filterBox}>
          <FormControl component="fieldset" className={classes.filterFieldSet} >
            <FormGroup>
              {
                deviceNames.map((deviceName) => (
                  <FormControlLabel
                    key={deviceName}
                    control={<div style={{ width: 16, height: 16, border: '0.666667px solid #E0E0E0', display: 'inline' }}>
                      <input style={{ display: 'none' }} type="checkbox" name={deviceName} onChange={handleChange} />
                      {checked[deviceName] && <span style={{ zIndex: 10, display: 'flex', alignItems: 'center' }}>
                        <DoneOutlinedIcon style={{ fontSize: 14 }} />
                      </span>
                      }
                    </div>
                    }
                    label={deviceName}
                  />
                ))
              }

            </FormGroup>
          </FormControl>
        </Box>
      }

    </Box>
  )
}

export default DevicesFilter