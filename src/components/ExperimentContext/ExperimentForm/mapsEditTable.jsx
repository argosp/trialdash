import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  IconButton,
  Icon,
} from '@material-ui/core';
import { MapsEditRow } from "./mapsEditRow";

export const MapsEditTable = ({ data, setData, client }) => {
  if (!data) {
    data = []
  }
  return (
    <TableContainer component={Paper} style={{ marginBottom: 100 }}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>
              <IconButton
                onClick={() => {
                  setData(data.concat({
                    imageUrl: "",
                    imageName: 'image ' + (data.length + 1),
                    lower: 32.08083,
                    right: 34.78876,
                    upper: 32.08962,
                    left: 34.77524,
                    embedded: true
                  }))
                }}
              >
                <Icon>add</Icon>
              </IconButton>
            </TableCell>
            <TableCell>Image name</TableCell>
            <TableCell align="right">Image</TableCell>
            <TableCell align="right">Lower Right</TableCell>
            <TableCell align="right">Upper Left</TableCell>
            <TableCell align="right">Emdedded on map?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <MapsEditRow
              key={i}
              row={row}
              deleteRow={() => {
                let dataUpdate = [...data];
                dataUpdate.splice(i, 1);
                setData([...dataUpdate]);
              }}
              setRow={(row) => {
                const newdata = data.slice();
                newdata[i] = row;
                setData(newdata);
              }}
              client ={client}
            ></MapsEditRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
