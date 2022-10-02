import React, { useEffect, useState } from 'react';
import { fromPairs } from 'lodash';
import {
  Typography,
  Box,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
} from '@material-ui/core';
import { ReactComponent as FilterIcon } from './FilterIcon.svg';

import DoneOutlinedIcon from '@material-ui/icons/DoneOutlined';

const EntityTypeFilter = ({
  classes,
  entitiesNames,
  handleFilterDevices,
  filteredEntities,
  isFiltered,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [checked, setChecked] = useState(fromPairs(entitiesNames.map((name) => [name, false])));
  const handleChange = (e) => {
    const name = e.target.name;
    const v = e.target.checked;
    setChecked((p) => ({ ...p, [name]: v }));
    handleFilterDevices({ ...checked, [name]: v });
  };
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" className="tbpRow">
      <Typography component="span">
        <Box component="span" sx={{ fontWeight: 600 }}>
          Devices
        </Box>
      </Typography>

      <Button
        startIcon={<FilterIcon height={13.5} width={13.5} />}
        onClick={() => setIsFilterOpen((p) => !p)}>
        <Typography
          component="span"
          style={{
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '15px',
            textTransform: 'capitalize',
            marginLeft: '-6px',
          }}>
          Filter
        </Typography>
        {isFiltered && (
          <>
            <Typography
              component="span"
              style={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '15px',
                textTransform: 'capitalize',
              }}>
              :&nbsp;
            </Typography>

            <Typography
              component="span"
              style={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '15px',
                color: '#27AE60',
                textTransform: 'capitalize',
              }}>
              {filteredEntities.map((entity) => entity.name).join(', ')}
            </Typography>
          </>
        )}
      </Button>
      {isFilterOpen && (
        <Box className={classes.filterBox}>
          <FormControl component="div" fullWidth>
            <FormGroup>
              {entitiesNames.map((deviceName) => (
                <FormControlLabel
                  key={deviceName}
                  style={{
                    display: 'flex',
                    gap: 4,
                  }}
                  control={
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: '0.666667px solid #E0E0E0',
                        display: 'inline',
                      }}>
                      <input
                        style={{ display: 'none' }}
                        type="checkbox"
                        name={deviceName}
                        onChange={handleChange}
                        checked={checked[deviceName]}
                      />
                      {checked[deviceName] && (
                        <span
                          style={{
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          <DoneOutlinedIcon style={{ fontSize: 14 }} />
                        </span>
                      )}
                    </div>
                  }
                  label={deviceName}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default EntityTypeFilter;
