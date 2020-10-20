import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  Collapse,
  Typography,
  Box,
  IconButton,
  Icon
} from '@material-ui/core';

const Row = ({ row, setRow }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <Icon>keyboard_arrow_up</Icon> : <Icon>keyboard_arrow_down</Icon>}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.imageName}
        </TableCell>
        <TableCell align="right">
          <img
            src={row.imageUrl || ""}
            style={{ width: "100%" }}
          />
        </TableCell>
        <TableCell align="right">
          {row.lower + "," + row.right}
        </TableCell>
        <TableCell align="right">
          {row.upper + "," + row.left}
        </TableCell>
        <TableCell align="right">
          {row.embedded}
        </TableCell>
      </TableRow>
      {/* <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      <Typography variant="h6" gutterBottom component="div">
                        History
                      </Typography>
                      <Table size="small" aria-label="purchases">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Total price ($)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {row.history.map((historyRow) => (
                            <TableRow key={historyRow.date}>
                              <TableCell component="th" scope="row">
                                {historyRow.date}
                              </TableCell>
                              <TableCell>{historyRow.customerId}</TableCell>
                              <TableCell align="right">{historyRow.amount}</TableCell>
                              <TableCell align="right">
                                {Math.round(historyRow.amount * row.price * 100) / 100}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow> */}
    </>
  )
}

export default function MapsEditTable({ data, setData }) {
  if (!data) {
    data = []
  }
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Image name</TableCell>
            <TableCell align="right">Image</TableCell>
            <TableCell align="right">Lower Right</TableCell>
            <TableCell align="right">Upper Left</TableCell>
            <TableCell align="right">Emdedded on map?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <Row row={row} key={i}></Row>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  // const columns = [
  //   {
  //     title: "Image",
  //     field: "image",
  //     render: (rowData) => (
  //       <img
  //         src={rowData.imageUrl || ""}
  //         style={{ width: "100%" }}
  //       />
  //     ),
  //     editComponent: (props) => (
  //       <input
  //         type="file"
  //         value={props.value}
  //         onChange={(e) => {
  //           props.rowData.imageUrl = window.URL.createObjectURL(e.target.files[0]);
  //         }}
  //       />
  //     ), //check value to save (what type?), value to display as blob
  //   },
  //   {
  //     title: "Image name",
  //     field: "imageName",
  //   },
  //   {
  //     title: "Bounds (x,y)",
  //     field: "bounds",
  //   },
  //   {
  //     title: "Scale",
  //     field: "scale",
  //     type: "numeric",
  //   },
  // ];


  // return (
  //   //TODO: change V icon to -'OfflinePinOutlined' icon
  //   <div style={{ maxWidth: "100%", marginBottom: 100 }}>
  //     <MaterialTable
  //       title="Images and locations"
  //       columns={columns}
  //       data={data}
  //       detailPanel={[
  //         {
  //           tooltip: 'Show Name',
  //           render: rowData => {
  //             return (
  //               <div
  //                 style={{
  //                   fontSize: 100,
  //                   textAlign: 'center',
  //                   color: 'white',
  //                   backgroundColor: '#43A047',
  //                 }}
  //               >
  //                 <img
  //                   src={rowData.imageUrl || ""}
  //                   style={{ width: "100%" }}
  //                 />
  //               </div>
  //             )
  //           },
  //         }]}
  //       editable={{
  //         onRowAdd: (newData) =>
  //           new Promise((resolve) => {
  //             setData([...data, newData]);
  //             resolve();
  //           }),
  //         onRowUpdate: (newData, oldData) =>
  //           new Promise((resolve, reject) => {
  //             if (oldData) {
  //               let dataUpdate = [...data];
  //               dataUpdate[data.indexOf(oldData)] = newData;
  //               setData([...dataUpdate]);
  //             }
  //             resolve();
  //           }),
  //         onRowDelete: (oldData) =>
  //           new Promise((resolve) => {
  //             let dataUpdate = [...data];
  //             dataUpdate.splice(data.indexOf(oldData), 1);
  //             setData([...dataUpdate]);
  //             resolve();
  //           }),
  //       }}
  //     />
  //   </div>
  // );
}
