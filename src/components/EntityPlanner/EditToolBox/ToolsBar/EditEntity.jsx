import React from 'react';
import { makeStyles } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Button } from './Button';
import { isObject, isArray } from 'lodash';

const useStyles = makeStyles({
  table: {
    maxWidth: 550,
    minWidth: 350,
    '& .MuiTableCell-root': {
      borderBottom: 0,
    },
  },
  inputField: {
    width: 90,
    height: 30,
    '&>*': {
      width: 'inherit',
      height: 'inherit',
    },
  },
  inputPositionField: {
    width: 50,
    height: 'inherit',
    '&>*': {
      width: 'inherit',
      height: 'inherit',
    },
  },
  tableRow: {
    '&>*': {
      padding: 8,
      fontSize: 14,
    },
  },
});

function createData(key, name, type, weight, height, positionX, positionY, icon) {
  return { key, name, type, weight, height, positionX, positionY, icon };
}

const EditEntityTool = ({ rows, classes }) => {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table className={classes.table} aria-label="edit entity table">
        <TableHead>
          <TableRow className={classes.tableRow}>
            <TableCell> Name </TableCell>
            <TableCell> Type </TableCell>
            <TableCell> Weight </TableCell>
            <TableCell> Height </TableCell>
            <TableCell> Position </TableCell>
            <TableCell> {'  '} </TableCell>
            <TableCell> {'  '} </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            // row.map((row) => (

            // name, type, weight, height, positionX, positionY, icon
            <TableRow key={row.key} className={classes.tableRow}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.weight}</TableCell>
              <TableCell>{row.height}</TableCell>
              <TableCell>{row.positionX}</TableCell>
              <TableCell>{row.positionY}</TableCell>
              <TableCell>{row.icon}</TableCell>
            </TableRow>
            // ))
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function EditEntity({ TBPEntities, removeEntityFromTBPTable }) {
  const classes = useStyles();
  let rows = [];
  for (const entityType of TBPEntities) {
    entityType.items.forEach((entity) => {
      const lastIndex = entity.properties.length - 1;
      const locations = entity.properties[lastIndex].val;
      let locationX = null;
      let locationY = null;
      if (isObject(locations) && isArray(locations.coordinates)) {
        locationX = locations.coordinates[0];
        locationY = locations.coordinates[1];
      }
      rows.push(
        createData(
          `${entity.key}`,
          <TextField
            disabled
            className={classes.inputField}
            defaultValue={entity.name}
            variant="outlined"
          />,
          <TextField
            disabled
            className={classes.inputField}
            defaultValue={entityType.name}
            variant="outlined"
          />,
          <TextField className={classes.inputField} defaultValue="20kg" variant="outlined" />,
          <TextField className={classes.inputField} defaultValue="50cm" variant="outlined" />,
          <TextField
            className={classes.inputPositionField}
            InputProps={{
              startAdornment: <InputAdornment position="start">x</InputAdornment>,
            }}
            defaultValue={locationX}
          />,
          <TextField
            className={classes.inputPositionField}
            InputProps={{
              startAdornment: <InputAdornment position="start">y</InputAdornment>,
            }}
            defaultValue={locationY}
          />,
          <IconButton onClick={() => removeEntityFromTBPTable(entity)}>
            <DeleteIcon />
          </IconButton>
        )
      );
    });
  }
  // ))
  console.log(rows);
  return (
    <>
      <EditEntityTool rows={rows} classes={classes} />
      <Button text="save changes" onClick={() => {}} />
    </>
  );
}

export default EditEntity;
