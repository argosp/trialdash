import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import uuid from 'uuid/v4';
import Graph from '../../apolloGraphql';
import {
  DEVICE_TYPES_CONTENT_TYPE,
  TRIAL_SETS_CONTENT_TYPE,
} from '../../constants/base';
import FieldTypesPanel from '../FieldTypesPanel';
import deviceTypeMutation from '../DeviceContext/utils/deviceTypeMutation';
import {
  FIELD_TYPE_ITEM_INPUT_TYPE,
  FIELD_TYPES_ARRAY,
} from '../../constants/attributes';
import ContentHeader from '../ContentHeader';
import CustomInput from '../CustomInput';
import CustomHeadline from '../CustomHeadline';
import FieldTypeItem from '../FieldTypeItem';
import Footer from '../Footer';
import { styles } from './styles';
import trialSetMutation from '../TrialSetContext/utils/trialSetMutation';

const graphql = new Graph();

class AddSetForm extends React.Component {
  state = {
    formObject:
      DEVICE_TYPES_CONTENT_TYPE === this.props.type
        ? {
          id: '',
          name: '',
          experimentId: this.props.experimentId,
          numberOfDevices: 0,
          numberOfFields: 0,
          properties: [],
        }
        : {
          id: '',
          name: '',
          description: '',
          experimentId: this.props.experimentId,
          numberOfTrials: 0,
          properties: [],
        },
    fieldTypes: FIELD_TYPES_ARRAY,
    selectedFieldTypes: [],
    idToList: {
      droppable: 'selectedFieldTypes',
      droppable2: 'fieldTypes',
    },
  };

  cancelForm = () => {
    const { type, changeContentType } = this.props;

    changeContentType(type);
  };

  changeFieldTypeValueHandler = (event, key) => {
    const { selectedFieldTypes } = this.state;
    const changedFieldTypes = [];

    selectedFieldTypes.forEach((selectedFieldType) => {
      const fieldType = { ...selectedFieldType };
      if (fieldType.key === key) fieldType.val = event.target.value;

      changedFieldTypes.push(fieldType);
    });

    this.setState({ selectedFieldTypes: changedFieldTypes });
  };

  addAdditionalFields = (entity) => {
    const { selectedFieldTypes } = this.state;
    const { type } = this.props;
    const resultEntity = { ...entity };

    // add number of field types to the device type
    if (DEVICE_TYPES_CONTENT_TYPE === type) resultEntity.numberOfFields = selectedFieldTypes.length;

    // add field types
    resultEntity.properties = [];

    selectedFieldTypes.forEach((fieldType) => {
      const property = {
        key: fieldType.key,
        val: fieldType.val,
        type: fieldType.type,
      };

      resultEntity.properties.push(property);
    });

    return resultEntity;
  };

  submitEntity = (entity) => {
    const newEntity = this.addAdditionalFields(entity);

    const { type } = this.props;
    const mutation = DEVICE_TYPES_CONTENT_TYPE === type
      ? deviceTypeMutation
      : trialSetMutation;

    graphql
      .sendMutation(mutation(newEntity))
      .then(() => {
        window.alert('Saved!');
      })
      .catch((err) => {
        window.alert(`error: ${err}`);
      });
  };

  reorderDraggedFieldTypes = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  // Moves an item from one list to another list
  moveFieldType = (
    source,
    destination,
    droppableSource,
    droppableDestination,
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  getListOfDraggableItems = id => this.state[this.state.idToList[id]];

  onDragEnd = ({ source, destination }) => {
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const reorderedItems = this.reorderDraggedFieldTypes(
        this.getListOfDraggableItems(source.droppableId),
        source.index,
        destination.index,
      );

      this.setState({ selectedFieldTypes: reorderedItems });
    } else {
      const result = this.moveFieldType(
        this.getListOfDraggableItems(source.droppableId),
        this.getListOfDraggableItems(destination.droppableId),
        source,
        destination,
      );

      this.setState({
        selectedFieldTypes: result.droppable,
        fieldTypes: result.droppable2,
      });
    }
  };

  inputChangeHandler = (e, type) => {
    const { value } = e.target;

    this.setState(state => ({
      formObject: { ...state.formObject, [type]: value },
    }));
  };

  cloneDraggedFieldType = (fieldType) => {
    const clonedFieldType = { ...fieldType };
    clonedFieldType.key = uuid();

    this.setState(state => ({
      selectedFieldTypes: [...state.selectedFieldTypes, clonedFieldType],
    }));
  };

  render() {
    const { fieldTypes, selectedFieldTypes } = this.state;
    const { classes, theme, type } = this.props;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <ContentHeader
          title={
            DEVICE_TYPES_CONTENT_TYPE === type
              ? 'Add device type'
              : 'Add trial set'
          }
          bottomDescription="a short description of what it means to add an item here"
        />
        <FieldTypesPanel fieldTypes={fieldTypes} />
        <form className={classes.form}>
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <CustomInput
                onChange={e => this.inputChangeHandler(e, 'name')}
                id="entity-name"
                label="Name"
                bottomDescription="a short description about the name"
              />
            </Grid>
            <Grid item xs={3}>
              <CustomInput
                onChange={e => this.inputChangeHandler(e, 'id')}
                id="entity-id"
                label="ID"
                bottomDescription="a short description about the id"
              />
            </Grid>
          </Grid>
          {TRIAL_SETS_CONTENT_TYPE === type ? (
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <CustomInput
                  onChange={e => this.inputChangeHandler(e, 'description')}
                  id="entity-description"
                  label="Description"
                  bottomDescription="a short description"
                />
              </Grid>
            </Grid>
          ) : null}
          <CustomHeadline
            className={classes.attributesHeadline}
            title="Attributes"
            description="Drag fields from the right bar"
            titleFontSize={18}
            descriptionFontSize={16}
            titleColor={theme.palette.black.main}
            descriptionColor={theme.palette.gray.dark}
          />
          <Droppable droppableId="droppable">
            {droppableProvided => (
              <div
                ref={droppableProvided.innerRef}
                className={classes.dropZone}
              >
                {selectedFieldTypes.map((fieldType, index) => (
                  <Draggable
                    key={fieldType.key}
                    draggableId={fieldType.key}
                    index={index}
                  >
                    {draggableProvided => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                      >
                        <FieldTypeItem
                          inputValue={fieldType.val}
                          cloneFieldType={() => this.cloneDraggedFieldType(fieldType)}
                          fieldType={fieldType.type}
                          contentType={FIELD_TYPE_ITEM_INPUT_TYPE}
                          title={fieldType.title}
                          inputId={fieldType.key}
                          changeFieldTypeValueHandler={event => this.changeFieldTypeValueHandler(
                            event,
                            fieldType.key,
                          )
                          }
                          placeholder="enter value"
                          description="a short description of the field"
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </form>
        <Footer
          cancelButtonHandler={this.cancelForm}
          saveButtonHandler={() => this.submitEntity(this.state.formObject)}
        />
      </DragDropContext>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AddSetForm);
