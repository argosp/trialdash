import React from 'react';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
import { DragDropContext } from 'react-beautiful-dnd';
import Graph from '../../../apolloGraphql';
// import deviceMutation from './utils/deviceMutation';
import { DEVICE_TYPES_CONTENT_TYPE } from '../../../constants/base';
import AddForm from '../../AddForm';
import FieldTypesPanel from '../../FieldTypesPanel';
import deviceTypeMutation from './utils/deviceTypeMutation';
import { FIELD_TYPES_ARRAY } from '../../../constants/attributes';

const graphql = new Graph();

class DeviceTypeForm extends React.Component {
  state = {
    fieldTypes: FIELD_TYPES_ARRAY,
    selectedFieldTypes: [],
    idToList: {
      droppable: 'selectedFieldTypes',
      droppable2: 'fieldTypes',
    },
  };

  cancelForm = () => {
    this.props.changeContentType(DEVICE_TYPES_CONTENT_TYPE);
  };

  changeFieldTypeValue = (event, key) => {
    const { selectedFieldTypes } = this.state;
    const changedFieldTypes = [];

    selectedFieldTypes.forEach((selectedFieldType) => {
      const fieldType = selectedFieldType;
      if (fieldType.key === key) fieldType.val = event.target.value;

      changedFieldTypes.push(fieldType);
    });

    this.setState({ selectedFieldTypes: changedFieldTypes });
  };

  /*
  handleChange = key => (event) => {
    this.setState({
      [key]: event.target.value,
    });
  };

  addProperty = () => {
    this.state.properties.push({ key: '', val: '' });
    this.setState({});
  };

  handleChangeProprty = (index, key) => (event) => {
    this.state.properties[index][key] = event.target.value;
    this.setState({});
  }; */

  addPropertiesAndFieldsNumber = (deviceType) => {
    const { selectedFieldTypes } = this.state;
    const resultDeviceType = deviceType;

    resultDeviceType.numberOfFields = selectedFieldTypes.length;

    resultDeviceType.properties = [];

    selectedFieldTypes.forEach((fieldType) => {
      const property = { key: fieldType.key, val: fieldType.val, type: fieldType.type };

      resultDeviceType.properties.push(property);
    });

    return resultDeviceType;
  };

  submitDeviceType = (deviceType) => {
    const newDeviceType = this.addPropertiesAndFieldsNumber(deviceType);

    graphql
      .sendMutation(deviceTypeMutation(newDeviceType))
      .then((data) => {
        window.alert(
          `saved ${data.addUpdateDeviceTypes.name}`,
        );
        // this.props.showAll();
      })
      .catch((err) => {
        window.alert(`error: ${err}`);
      });
  };

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  // Moves an item from one list to another list
  move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  getList = id => this.state[this.state.idToList[id]];

  onDragEnd = ({ source, destination }) => {
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const reorderedItems = this.reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index,
      );

      this.setState({ selectedFieldTypes: reorderedItems });
    } else {
      const result = this.move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination,
      );

      this.setState({
        selectedFieldTypes: result.droppable,
        fieldTypes: result.droppable2,
      });
    }
  };

  render() {
    const { fieldTypes, selectedFieldTypes } = this.state;
    const { experimentId } = this.props;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <AddForm
          initialValues={{
            id: '',
            experimentId,
            name: '',
            numberOfDevices: 0,
            numberOfFields: 0,
            properties: [],
          }}
          withFooter
          rightPanel={<FieldTypesPanel fieldTypes={fieldTypes} />}
          selectedAttributes={selectedFieldTypes}
          cancelFormHandler={this.cancelForm}
          saveFormHandler={this.submitDeviceType}
          changeAttributeValueHandler={this.changeFieldTypeValue}
          headerTitle="Add device type"
          headerDescription="a short description of what it means to add a device here"
          commonInputs={[
            {
              key: 0,
              id: 'device-type-name',
              label: 'Name',
              description: 'a short description about the device name',
            },
            {
              key: 1,
              id: 'device-type-id',
              label: 'ID',
              description: 'a short description about the device name',
            },
          ]}
        />
        {/*        <TextField
          style={{ width: '300px', marginTop: '30px' }}
          id="name"
          label="Name Format"
          className={classes.textField}
          value={this.state.name}
          onChange={this.handleChange('name')}
        />
        <br />
        <TextField
          style={{ width: '300px', marginTop: '30px' }}
          id="type"
          label="Type"
          className={classes.textField}
          value={this.state.type}
          onChange={this.handleChange('type')}
        />
        <br />
        <TextField
          style={{ width: '300px', marginTop: '30px' }}
          id="number"
          type="number"
          label={`Number of ${this.props.entityType}s`}
          className={classes.textField}
          value={this.state.number}
          onChange={this.handleChange('number')}
          inputProps={{ min: '1' }}
        />
        <br />
        <TextField
          style={{ width: '300px', marginTop: '30px' }}
          id="notes"
          label="Notes"
          multiline
          rows={5}
          className={classes.textField}
          value={this.state.notes}
          onChange={this.handleChange('notes')}
        />
        <br />
        <h3>properties:</h3>
        {this.state.properties.map((p, i) => (
          <div key={i} style={{ display: 'flex' }}>
            <TextField
              style={{ width: '300px' }}
              label="name"
              className={classes.textField}
              value={p.key}
              onChange={this.handleChangeProprty(i, 'key')}
            />
            <br />
            <InputLabel htmlFor="select-multiple-chip">Type</InputLabel>
            <Select
              value={p.type}
              onChange={this.handleChangeProprty(i, 'type')}
              MenuProps={MenuProps}
            >
              {this.state.options
                && this.state.options.map(o => (
                  <MenuItem key={o} value={o}>
                    {o}
                  </MenuItem>
                ))}
            </Select>
            <TextField
              style={{ width: '300px' }}
              type={p.type}
              label="value"
              className={classes.textField}
              value={p.val}
              onChange={this.handleChangeProprty(i, 'val')}
            />
            <br />
          </div>
        ))}
        <Button
          variant="contained"
          className={classes.button}
          style={{ width: '180px' }}
          onClick={this.addProperty}
        >
          + Add Property
        </Button>
        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <div style={{ marginTop: '50px', textAlign: 'center' }}>
            <Button
              variant="contained"
              className={classes.button}
              style={{ width: '180px' }}
              onClick={this.submitDevice}
            >
              Submit
            </Button>
          </div>
          {this.props.cancel && (
            <Button
              variant="contained"
              className={classes.button}
              style={{ width: '180px' }}
              onClick={this.props.showAll}
            >
              Cancel
            </Button>
          )}
        </div> */}
      </DragDropContext>
    );
  }
}

export default DeviceTypeForm;
