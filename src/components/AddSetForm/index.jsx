import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
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
import EditFieldTypePanel from '../EditFieldTypePanel';

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

    // this field correspond to the <Droppable droppableId="droppable2">
    fieldTypes: FIELD_TYPES_ARRAY,

    // this field correspond to the <Droppable droppableId="droppable">
    selectedFieldTypes: [],
    isEditModeEnabled: false,
    isDragDisabled: false,
    editedFieldTypeId: '',
  };

  activateEditMode = (editedFieldTypeId) => {
    this.setState({ isEditModeEnabled: true, isDragDisabled: true, editedFieldTypeId });
  };

  deactivateEditMode = () => {
    this.setState({ isEditModeEnabled: false, isDragDisabled: false, editedFieldTypeId: '' });
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

  // Moves an field type from right-side bar to the Attribute list
  moveFieldType = (
    source,
    destination,
    droppableSource,
    droppableDestination,
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const fieldType = sourceClone[droppableSource.index];

    destClone.splice(droppableDestination.index, 0, {
      ...fieldType,
      key: uuid(),
    });

    return destClone;
  };

  onDragEnd = ({ source, destination }) => {
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      this.setState(state => ({
        selectedFieldTypes: this.reorderDraggedFieldTypes(
          state.selectedFieldTypes,
          source.index,
          destination.index,
        ),
      }));
    } else {
      this.setState(state => ({
        selectedFieldTypes: this.moveFieldType(
          state.fieldTypes,
          state.selectedFieldTypes,
          source,
          destination,
        ),
      }));
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

  deleteDraggedFieldType = (fieldType) => {
    this.setState(state => ({
      selectedFieldTypes: state.selectedFieldTypes.filter(
        selectedFieldType => selectedFieldType.key !== fieldType.key,
      ),
    }));
  };

  render() {
    const {
      fieldTypes,
      selectedFieldTypes,
      isEditModeEnabled,
      isDragDisabled,
      editedFieldTypeId,
    } = this.state;
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
        {isEditModeEnabled ? (
          <EditFieldTypePanel
            deactivateEditMode={this.deactivateEditMode}
          />
        ) : (
          <FieldTypesPanel fieldTypes={fieldTypes} />
        )}
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
                className={
                  isEmpty(selectedFieldTypes)
                    ? classes.dropZoneEmpty
                    : classes.dropZone
                }
              >
                {selectedFieldTypes.map((fieldType, index) => (
                  <Draggable
                    key={fieldType.key}
                    draggableId={fieldType.key}
                    index={index}
                    isDragDisabled={isDragDisabled}
                  >
                    {draggableProvided => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                      >
                        <FieldTypeItem
                          editedFieldTypeId={editedFieldTypeId}
                          isEditModeEnabled={isEditModeEnabled}
                          activateEditMode={this.activateEditMode}
                          cloneFieldType={() => this.cloneDraggedFieldType(fieldType)}
                          deleteFieldType={() => this.deleteDraggedFieldType(fieldType)}
                          fieldType={fieldType}
                          contentType={FIELD_TYPE_ITEM_INPUT_TYPE}
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
        {!isEditModeEnabled ? (
          <Footer
            cancelButtonHandler={this.cancelForm}
            saveButtonHandler={() => this.submitEntity(this.state.formObject)}
          />
        ) : null}
      </DragDropContext>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AddSetForm);
