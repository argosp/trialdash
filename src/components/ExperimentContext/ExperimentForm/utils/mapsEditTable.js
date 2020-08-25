import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
export default function MapsEditTable() {
    //get porps
  const [data, setData] = useState([{ imageUrl: "https://d33wubrfki0l68.cloudfront.net/ca0061c3c33c88b2b124e64ad341e15e2a17af49/c8765/images/alligator-logo3.svg",imageName: 'fdsaf',bounds:'3,5', scale: 1987 }
  ],);
  const columns = [
    { title: 'Image', field: 'image',
     render: rowData => <img src={rowData.imageUrl} style={{width: 50, borderRadius: '50%'}}/>,
     editComponent: props => (
      <input
        type="file"
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    )},
    { title: 'Image name', field: 'imageName' },
    { title: 'Bounds (x,y)', field: 'bounds' },
    { title: 'Scale', field: 'scale', type: 'numeric' },

  ]
  useEffect(() => {
      let mounted =true;
      if(mounted){
    console.log('data in useEffect ',data);
      }
      return () => mounted = false;

  },[data]);

  const handleRowUpdate = (newData, oldData)=>  {
    console.log('handleRowUpdate ',newData,oldData);
    const dataUpdate = [...data];
    dataUpdate[data.indexOf(oldData)] = newData;
    setData([...dataUpdate]);
 }
 const handleRowAdd = (newData)=>  {
    console.log('handleRowAdd ',newData);
    const dataUpdate = [...data];
    dataUpdate.push = newData;
    setData([...dataUpdate]);
 }

 const handleRowDelete = (oldData)=>  {
    console.log('handleRowDelete ',oldData);
    const dataUpdate = [...data];
    dataUpdate.splice(data.indexOf(oldData), 1);
    setData([...dataUpdate]);
 }

  return (
    <div style={{ maxWidth: "100%" }}>
    {/* <button onClick={() => setCount(count + 1)}> */}
    <MaterialTable
      title="Images and locations"
      columns={columns}
      data={data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              handleRowAdd(newData);
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
               handleRowUpdate(newData,oldData);
              }
            }, 600)
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              handleRowDelete(oldData);
            }, 600);
          }),
      }}
    />
    </div>

    
     
  );
}