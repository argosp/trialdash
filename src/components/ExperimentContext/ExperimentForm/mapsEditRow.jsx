import React, { useState, useRef } from "react";
import gql from "graphql-tag";
import { BasketIcon, PenIcon } from "../../../constants/icons";
import {
  TableRow,
  TableCell,
  Collapse,
  IconButton,
  Icon,
  Checkbox,
  TextField,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import { MapsEditDetails } from "./mapsEditDetails";
import config from "../../../config";

const UPLOAD_FILE = gql`
  mutation ($file: Upload!) {
    uploadFile(file: $file) {
      filename
      path
    }
  }
`;

const InputImageIcon = ({ onChangeFile, client }) => {
  const inputFile = useRef(null);
  const [working, setWorking] = useState(false);

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  const getImageSize = async (imageFile) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve([img.naturalHeight, img.naturalWidth]);
      };
      img.src = window.URL.createObjectURL(imageFile);
    });
  };

  const handleChangeFile = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    setWorking(true);

    const file = event.target.files[0];
    const [height, width] = await getImageSize(file);
    if (height && width) {
      const imageServerfFilename = await uploadFileToServer(file);
      if (imageServerfFilename) {
        onChangeFile(imageServerfFilename.path, height, width);
      }
    }
    setWorking(false);
  };

  const uploadFileToServer = async (file) => {
    const data = await client.mutate({
      mutation: UPLOAD_FILE,
      variables: { file },
    });
    if (
      !data ||
      !data.data ||
      !data.data.uploadFile ||
      data.data.uploadFile === "err"
    ) {
      return undefined;
    }
    return data.data.uploadFile;
  };

  return (
    <>
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        onChange={handleChangeFile}
        accept="image/*"
      />
      <IconButton
        aria-label="expand row"
        onClick={onButtonClick}
        disabled={working}
      >
        {working ? <CircularProgress size={20} /> : <Icon>folder_open</Icon>}
      </IconButton>
    </>
  );
};

const TextLatLng = ({ lat, lng, setLat, setLng, editable }) => {
  if (!editable) {
    return lat + "," + lng;
  }
  return (
    <Grid container justifyContent="space-evenly" alignItems="center">
      <TextField
        value={lat}
        onChange={(e) => setLat(parseFloat(e.target.value))}
        style={{ width: "80px" }}
      />
      <TextField
        value={lng}
        onChange={(e) => setLng(parseFloat(e.target.value))}
        style={{ width: "80px" }}
      />
    </Grid>
  );
};

export const mapDefaultBounds = {
  lower: 32.08083,
  right: 34.78876,
  upper: 32.08962,
  left: 34.77524,
};

const roundDec = (num) => {
  return Math.round(num * 1000) / 1000;
};

export const MapsEditRow = ({ row, setRow, deleteRow, client }) => {
  const [open, setOpen] = useState(false);
  const [lastEmbeddedBounds, setLastEmbeddedBounds] =
    useState(mapDefaultBounds);

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
          <InputImageIcon
            aria-label="expand row"
            onChangeFile={(imageUrl, height, width) => {
              setRow({ ...row, imageUrl, width, height });
            }}
            client={client}
          ></InputImageIcon>
        </TableCell>
        <TableCell component="th" scope="row" style={{ padding: 0 }}>
          {!open ? (
            row.imageName
          ) : (
            <TextField
              value={row.imageName}
              onChange={(e) => setRow({ ...row, imageName: e.target.value })}
            />
          )}
        </TableCell>
        <TableCell align="right" style={{ padding: 0 }}>
          {!row.imageUrl ? null : (
            <img
              alt=""
              src={config.url + "/" + row.imageUrl}
              style={{ height: "50px", borderRadius: "50px" }}
            />
          )}
        </TableCell>
        <TableCell align="right">
          <TextLatLng
            editable={open}
            lat={row.embedded ? row.lower : roundDec(row.lower)}
            lng={row.embedded ? row.right : roundDec(row.right)}
            setLat={(val) => setRow({ ...row, lower: val })}
            setLng={(val) => setRow({ ...row, right: val })}
          ></TextLatLng>
        </TableCell>
        <TableCell align="right">
          <TextLatLng
            editable={open}
            lat={row.embedded ? row.upper : roundDec(row.upper)}
            lng={row.embedded ? row.left : roundDec(row.left)}
            setLat={(val) => setRow({ ...row, upper: val })}
            setLng={(val) => setRow({ ...row, left: val })}
          ></TextLatLng>
        </TableCell>
        <TableCell align="right">
          <Checkbox
            disabled={!open}
            onChange={(e, val) => {
              if (!val && row.height && row.width) {
                setLastEmbeddedBounds({
                  left: row.left,
                  right: row.right,
                  upper: row.upper,
                  lower: row.lower,
                });
                setRow({
                  ...row,
                  left: 0,
                  right: row.width,
                  lower: 0,
                  upper: row.height,
                  embedded: val,
                });
              } else {
                setRow({ ...row, ...lastEmbeddedBounds, embedded: val });
              }
            }}
            checked={row.embedded}
            color="primary"
          ></Checkbox>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <MapsEditDetails row={row} setRow={setRow}></MapsEditDetails>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
