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
} from '@mui/material';
import { mapDefaultBounds, MapsEditRow } from "./mapsEditRow";
import { ErrorBoundary } from "react-error-boundary";

export const MapsEditTable = ({ data, setData, client }) => {
  if (!data) {
    data = []
  }

  return (
    <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => (
      <div role="alert">
        <pre style={{ color: "red" }}>
          Error: {error.message}<br />
          {error.stack.split('\n').map(l => '\t' + l.split(RegExp(/[@\/]/))[0] + '\n').slice(0, 5)}
        </pre>
        <button onClick={resetErrorBoundary} >Retry</button>
      </div>
    )}>
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
                      lower: mapDefaultBounds.lower,
                      right: mapDefaultBounds.right,
                      upper: mapDefaultBounds.upper,
                      left: mapDefaultBounds.left,
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
                client={client}
              ></MapsEditRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ErrorBoundary>
  )
}
