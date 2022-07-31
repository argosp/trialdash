import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Button } from './Button';

const useStyles = makeStyles({
  table: {
    minWidth: 350,
  },
  inputField: {
    width: 150,
    height: 30,
    '&>*': {
      width: 'inherit',
      height: 'inherit',
    }
  },
  inputPositionField: {
    width: 50,
    height: 30,
    height: 'inherit',
    '&>*': {
      width: 'inherit',
      height: 'inherit',
    }
  }
});

function createData(name, type, weight, height, positionX, positionY, icon) {
  return { name, type, weight, height, positionX, positionY, icon };
}

const EditEntityTool = ({ rows, classes }) => {


  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="edit entity table">
        <TableHead>
          <TableRow>
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
            // name, type, weight, height, positionX, positionY, icon
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.weight}</TableCell>
              <TableCell>{row.height}</TableCell>
              <TableCell>{row.positionX}</TableCell>
              <TableCell>{row.positionY}</TableCell>
              <TableCell>{row.icon}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function EditEntity({ TBPEntities }) {
  console.log(TBPEntities)
  const classes = useStyles();

  const rows = TBPEntities.map(entity =>
    createData(
      <TextField className={classes.inputField} defaultValue="Entity 1" variant="outlined" />,
      <TextField className={classes.inputField} defaultValue="Samsung" variant="outlined" />,
      <TextField className={classes.inputField} defaultValue="20kg" variant="outlined" />,
      <TextField className={classes.inputField} defaultValue="50cm" variant="outlined" />,
      <TextField
        className={classes.inputPositionField}
        InputProps={{
          startAdornment: <InputAdornment position="start">x</InputAdornment>,
        }}
      />,
      <TextField
        className={classes.inputPositionField}
        InputProps={{
          startAdornment: <InputAdornment position="start">y</InputAdornment>,
        }}
      />,
      <IconButton><DeleteIcon /></IconButton>
    ))

  return (
    <div>
      <EditEntityTool rows={rows} classes={classes} />
      <Button text='save changes' onClick={(() => { })} />
    </div>
  )
}

export default EditEntity