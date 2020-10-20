import React, { useState, useEffect, useRef } from "react";
// import MaterialTable from "material-table";
import { BasketIcon, PenIcon } from '../../../../constants/icons';
import { Map as LeafletMap } from "react-leaflet";
import { TileLayer, LayersControl, ImageOverlay } from "react-leaflet";
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
  Checkbox,
  TextField,
  Grid
} from '@material-ui/core';

const InputImageIcon = ({ onChangeFile }) => {
  const inputFile = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };
  const handleChangeFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    onChangeFile(event.target.files[0]);
  }
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
  const mapAttrib = process.env.REACT_APP_MAP_ATTRIBUTION || '&copy; <a href="https://carto.com">Carto</a> contributors';
  const mapTileUrl = process.env.REACT_APP_MAP_URL || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';
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
        <TableCell component="th" scope="row" style={{ padding: 0 }}>
          {!open ? row.imageName :
            <TextField
              value={row.imageName}
              onChange={(e) => setRow({ ...row, imageName: e.target.value })}
            />
          }
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
          {!open ? row.lower + ',' + row.right :
            <Grid container justify="space-evenly" alignItems="center">
              <TextField
                value={row.lower}
                onChange={(e) => setRow({ ...row, lower: parseFloat(e.target.value) })}
                style={{ width: '80px' }}
              />
              <TextField
                value={row.right}
                onChange={(e) => setRow({ ...row, right: parseFloat(e.target.value) })}
                style={{ width: '80px' }}
              />
            </Grid>
          }
        </TableCell>
        <TableCell align="right">
          {!open ? row.upper + ',' + row.left :
            <Grid container justify="space-evenly" alignItems="center">
              <TextField
                value={row.upper}
                onChange={(e) => setRow({ ...row, upper: parseFloat(e.target.value) })}
                style={{ width: '80px' }}
              />
              <TextField
                value={row.left}
                onChange={(e) => setRow({ ...row, left: parseFloat(e.target.value) })}
                style={{ width: '80px' }}
              />
            </Grid>
          }
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
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <LeafletMap
              center={[(row.lower + row.upper) / 2, (row.left + row.right) / 2]}
              zoom={15}
              // ref={mapElement}
              style={{ height: "400px", width: '100%' }}
            >
              <TileLayer
                attribution={mapAttrib}
                url={mapTileUrl}
              />
              <ImageOverlay
                url={row.imageUrl}
                bounds={[[row.lower, row.right], [row.upper, row.left]]}
              />
            </LeafletMap>
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
              <IconButton
                onClick={() => {
                  setData(data.concat({
                    imageUrl: "",
                    imageName: 'image ' + (data.length + 1),
                    lower: 32.08083,
                    right: 34.77524,
                    upper: 32.08962,
                    left: 34.78876,
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
