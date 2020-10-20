import React, { useState, useEffect, useRef } from "react";
// import MaterialTable from "material-table";
import { BasketIcon, PenIcon } from '../../../../constants/icons';
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
  Icon,
  Checkbox
} from '@material-ui/core';

const InputImageIcon = ({ onChangeFile }) => {
  const inputFile = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };
  const handleChangeFile = ((event) => {
    event.stopPropagation();
    event.preventDefault();
    onChangeFile(event.target.files[0]);
  }).bind(this)
  return (
    <>
      <input
        type='file'
        id='file'
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={handleChangeFile}
        accept='image/*'
      />
      <IconButton aria-label="expand row" onClick={onButtonClick}>
        <Icon>folder_open</Icon>
      </IconButton>
    </>
  )
}

const Row = ({ row, setRow, deleteRow }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" onClick={() => setOpen(!open)}>
            {open ? <Icon>keyboard_arrow_up</Icon> : <PenIcon></PenIcon>}
          </IconButton>
          <IconButton aria-label="expand row" onClick={() => deleteRow()}>
            <BasketIcon></BasketIcon>
          </IconButton>
          <InputImageIcon aria-label="expand row"
            onChangeFile={(file) => {
              setRow({ ...row, imageUrl: window.URL.createObjectURL(file) });
            }}
          >
          </InputImageIcon>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.imageName}
        </TableCell>
        <TableCell align="right" style={{ padding: 0 }}>
          {!row.imageUrl ? null :
            <img
              src={row.imageUrl}
              style={{ height: '50px', borderRadius: '50px' }}
            />
          }
        </TableCell>
        <TableCell align="right">
          {row.lower + "," + row.right}
        </TableCell>
        <TableCell align="right">
          {row.upper + "," + row.left}
        </TableCell>
        <TableCell align="right">
          <Checkbox
            disabled={!open}
            onChange={(e, val) => setRow({ ...row, embedded: val })}
            checked={row.embedded}
          >
          </Checkbox>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              {!row.imageUrl ? null :
                <img
                  src={row.imageUrl}
                />
              }
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function MapsEditTable({ data, setData }) {
  if (!data) {
    data = []
  }
  return (
    <TableContainer component={Paper} style={{ marginBottom: 100 }}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>
              <IconButton>
                <Icon onClick={() => {
                  setData(data.concat({ imageUrl: "", imageName: 'image ' + (data.length + 1), lower: '0', right: '0', upper: '10', left: '10', embedded: true }))
                }}>add</Icon>
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
            <Row
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
            ></Row>
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
