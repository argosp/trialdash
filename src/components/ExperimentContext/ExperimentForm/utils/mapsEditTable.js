import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";

export default function MapsEditTable({ data, setData }) {
  const columns = [
    {
      title: "Image",
      field: "image",
      render: (rowData) => (
        <img
          src={rowData.imageUrl || ""}
          style={{ width: "100%" }}
        />
      ),
      editComponent: (props) => (
        <input
          type="file"
          value={props.value}
          onChange={(e) => {
            props.rowData.imageUrl = window.URL.createObjectURL(e.target.files[0]);
          }}
        />
      ), //check value to save (what type?), value to display as blob
    },
    {
      title: "Image name",
      field: "imageName",
    },
    {
      title: "Bounds (x,y)",
      field: "bounds",
    },
    {
      title: "Scale",
      field: "scale",
      type: "numeric",
    },
  ];

  return (
    //TODO: change V icon to -'OfflinePinOutlined' icon
    <div style={{ maxWidth: "100%", marginBottom: 100 }}>
      <MaterialTable
        title="Images and locations"
        columns={columns}
        data={data}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              setData([...data, newData]);
              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              if (oldData) {
                let dataUpdate = [...data];
                dataUpdate[data.indexOf(oldData)] = newData;
                setData([...dataUpdate]);
              }
              resolve();
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              let dataUpdate = [...data];
              dataUpdate.splice(data.indexOf(oldData), 1);
              setData([...dataUpdate]);
              resolve();
            }),
        }}
      />
    </div>
  );
}
