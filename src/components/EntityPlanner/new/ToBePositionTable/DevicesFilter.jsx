import React, { useEffect, useState } from 'react'
import { fromPairs } from 'lodash'
import { Typography, Box, Button, Checkbox, FormControl, FormLabel, FormGroup, FormControlLabel, IconButton } from '@material-ui/core'
import { ReactComponent as FilterIcon } from './FilterIcon.svg'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { withStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';

const StyledCheckbox = withStyles((theme) => ({
  root: {
    color: theme.palette.white.main,
    '& $checked': {
      color: theme.palette.black.dark,
    },
  },
  checked: {},
}))((props) => <Checkbox color="default" {...props} />);
const DevicesFilter = ({ classes, deviceNames, handleFilterDevices }) => {

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [checked, setChecked] = useState(fromPairs(deviceNames.map((name) => [name, false])))

  const handleChange = (filter, v) => {
    setChecked(p => ({ ...p, [filter]: v }))
    handleFilterDevices({ ...checked, [filter]: v })
  }

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
          <FormControl component="fieldset">
            <FormGroup>
              {
                deviceNames.map((deviceName) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={
                          <IconButton size="small" color="black">
                            <CheckBoxOutlinedIcon fontSize="small" />
                          </IconButton>
                        }
                        checked={checked[deviceName]}
                        // className={classes.filterCheckbox}
                        onChange={(e, v) => handleChange(deviceName, v)}
                        name={deviceName}
                      />}
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