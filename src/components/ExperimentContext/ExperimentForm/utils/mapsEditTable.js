import React, {
  useState,
  useEffect
} from 'react';
import MaterialTable from 'material-table';
export default function MapsEditTable( props ) {
  //get porps
  const [data, setData] = useState([{
    imageUrl: "",
    imageName: 'fdsaf',
    bounds: '3,5',
    scale: 1987
  }], );
  const columns = [{
      title: 'Image',
      field: 'image',
      render: rowData => < img src = {rowData.image || rowData.imageUrl || '' } style = {{width: '100%'}}/>,
      editComponent: props => (<input type = "file" value = { props.value} onChange = {e => { onChangeFile(e) }} />) //check value to save (what type?), value to display as blob
    },
    {
      title: 'Image name',
      field: 'imageName'
    },
    {
      title: 'Bounds (x,y)',
      field: 'bounds'
    },
    {
      title: 'Scale',
      field: 'scale',
      type: 'numeric'
    }
  ];
  let imageToDisplay;

  useEffect(() => {
    debugger
      let mounted = true;
      if(mounted){
        console.log('data in useEffect ',data);
        // props.onConfirm();
     }
      return () => mounted = false;

  },[data]);


  const onChangeFile = (e) => {
    const imageBlob = window.URL.createObjectURL(e.target.files[0]);
    console.log('imageToDisplay ', imageBlob)
    // URL.revokeObjectURL(imageToDisplay);
    imageToDisplay = imageBlob;
  }
  const setImage = (newData) =>{
    let updatedObj = newData;
    if (imageToDisplay != '') {
      updatedObj.imageUrl = imageToDisplay;
      imageToDisplay = '';
    }
    return updatedObj;
  }
  const handleRowUpdate = (newData, oldData) => {
    const updatedObj = setImage(newData);
    console.log('handleRowUpdate ', updatedObj, oldData);
    const dataUpdate = [...data];
    dataUpdate[data.indexOf(oldData)] = updatedObj;
    setData([...dataUpdate]);
  }
  const handleRowAdd = (newData) => {
    const updatedObj = setImage(newData);
    console.log('handleRowAdd ', updatedObj);
    setData([...data, updatedObj]);
  }

  const handleRowDelete = (oldData) => {
    console.log('handleRowDelete ', oldData);
    const dataUpdate = [...data];
    dataUpdate.splice(data.indexOf(oldData), 1);
    setData([...dataUpdate]);
  }

  return ( 
    <div style = {{maxWidth: "100%"}} >
    < MaterialTable title = "Images and locations"
    columns = { columns }
    data = { data }
    editable = {
      {
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              handleRowAdd(newData);
              resolve();
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve,reject) => {
            props.onConfirm();
            setTimeout(() => {
              if (oldData) {
                handleRowUpdate(newData, oldData);
              }
              resolve();
            }, 600)
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              handleRowDelete(oldData);
              resolve();
            }, 600);
          }),
      }
    }
    /> </div>
  );
}