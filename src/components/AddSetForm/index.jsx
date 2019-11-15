import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import uuid from 'uuid/v4';
import { isEmpty } from 'lodash';
import classnames from 'classnames';
import Box from '@material-ui/core/Box';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import {
  DEVICE_TYPES,
  TRIAL_SETS,
} from '../../constants/base';
import FieldTypesPanel from '../FieldTypesPanel';
import deviceTypeMutation from '../DeviceContext/utils/deviceTypeMutation';
import {
  FIELD_TYPE_ITEM_INPUT_TYPE,
  FIELD_TYPES_ARRAY,
} from '../../constants/fieldTypes';
import ContentHeader from '../ContentHeader';
import CustomInput from '../CustomInput';
import CustomHeadline from '../CustomHeadline';
import FieldTypeItem from '../FieldTypeItem';
import Footer from '../Footer';
import { styles } from './styles';
import trialSetMutation from '../TrialContext/utils/trialSetMutation';
import EditFieldTypePanel from '../EditFieldTypePanel';
import SimpleButton from '../SimpleButton';
import { updateCache } from '../../apolloGraphql';

class AddSetForm extends React.Component {
  state = {
    formObject:
      DEVICE_TYPES === this.props.formType
        ? {
          key: uuid(),
          id: '',
          name: '',
          experimentId: this.props.match.params.id,
          numberOfDevices: 0,
          properties: [], // this field correspond to the <Droppable droppableId="droppable">
        }
        : {
          key: uuid(),
          id: '',
          name: '',
          description: '',
          experimentId: this.props.match.params.id,
          numberOfTrials: 0,
          properties: [], // this field correspond to the <Droppable droppableId="droppable">
        },

    // this field correspond to the <Droppable droppableId="droppable2">
    fieldTypes: FIELD_TYPES_ARRAY,
    isEditModeEnabled: false,
    isDragDisabled: false,
    editedFieldType: {}, // used to cancel changes of a field type
    isDragging: false,
    isFieldTypesPanelOpen: true,
    isEditFieldTypePanelOpen: false,
  };

  openFieldTypesPanel = () => {
    this.setState({ isFieldTypesPanelOpen: true });
  };

  closeFieldTypesPanel = () => {
    this.setState({ isFieldTypesPanelOpen: false });
  };

  activateEditMode = (editedFieldType) => {
    this.setState({
      isEditModeEnabled: true,
      isDragDisabled: true,
      editedFieldType,
      isEditFieldTypePanelOpen: true,
    });
  };

  deactivateEditMode = () => {
    this.setState({
      isEditModeEnabled: false,
      isDragDisabled: false,
      editedFieldType: {},
      isEditFieldTypePanelOpen: false,
    });
  };

  cancelFieldTypeChanges = (fieldTypeKey) => {
    const initialState = this.state.editedFieldType;

    this.setState(state => ({
      formObject: {
        ...state.formObject,
        properties: state.formObject.properties.map(fieldType => (fieldType.key === fieldTypeKey
          ? { ...initialState }
          : fieldType)),
      },
    }));

    this.deactivateEditMode();
  };

  fieldTypeValueChangeHandler = (e, controlType, fieldTypeKey, property) => {
    let value;

    if (controlType === 'input') {
      ({ value } = e.target);
    } else value = e.target.checked;

    this.setState(state => ({
      formObject: {
        ...state.formObject,
        properties: state.formObject.properties.map(fieldType => (fieldType.key === fieldTypeKey
          ? { ...fieldType, [property]: value }
          : fieldType)),
      },
    }));
  };

  submitEntity = async (entity) => {
    const newEntity = entity;
    const { formType, match, history, client, cacheQuery, itemsName, mutationName } = this.props;

    // add number of field types to the device type
    if (DEVICE_TYPES === formType) {
      newEntity.numberOfFields = this.state.formObject.properties.length;
    }

    const mutation = DEVICE_TYPES === formType
      ? deviceTypeMutation
      : trialSetMutation;

    await client
      .mutate({
        mutation: mutation(newEntity),
        update: (cache, mutationResult) => {
          updateCache(
            cache,
            mutationResult,
            cacheQuery(match.params.id),
            itemsName,
            mutationName,
          );
        },
      });

    history.push(`/experiments/${match.params.id}/${formType}`);
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

  onDragStart = () => {
    this.setState({ isDragging: true });
  };

  onDragEnd = ({ source, destination }) => {
    this.setState({ isDragging: false });

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      this.setState(state => ({
        formObject: {
          ...state.formObject,
          properties: this.reorderDraggedFieldTypes(
            state.formObject.properties,
            source.index,
            destination.index,
          ),
        },
      }));
    } else {
      this.setState(state => ({
        formObject: {
          ...state.formObject,
          properties: this.moveFieldType(
            state.fieldTypes,
            state.formObject.properties,
            source,
            destination,
          ),
        },
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
      formObject: {
        ...state.formObject,
        properties: [...state.formObject.properties, clonedFieldType],
      },
    }));
  };

  deleteDraggedFieldType = (fieldType) => {
    this.setState(state => ({
      formObject: {
        ...state.formObject,
        properties: state.formObject.properties.filter(
          selectedFieldType => selectedFieldType.key !== fieldType.key,
        ),
      },
    }));
  };

  render() {
    const {
      fieldTypes,
      formObject,
      isEditModeEnabled,
      isDragDisabled,
      editedFieldType,
      isDragging,
      isFieldTypesPanelOpen,
      isEditFieldTypePanelOpen,
    } = this.state;
    const { classes, theme, formType, history, match } = this.props;
    let dropZoneClassName = classes.dropZone;

    if (isEmpty(formObject.properties) && isDragging) {
      dropZoneClassName = classnames(
        classes.dropZoneEmpty,
        classes.dropZoneEmptyDragging,
      );
    }

    if (isEmpty(formObject.properties) && !isDragging) {
      dropZoneClassName = classes.dropZoneEmpty;
    }

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <ContentHeader
          title={
            DEVICE_TYPES === formType
              ? 'Add device type'
              : 'Add trial set'
          }
          bottomDescription="a short description of what it means to add an item here"
        />
        {isEditModeEnabled ? (
          <EditFieldTypePanel
            isPanelOpen={isEditFieldTypePanelOpen}
            deactivateEditMode={this.deactivateEditMode}
            fieldType={formObject.properties.find(
              fieldType => fieldType.key === editedFieldType.key,
            )}
            onValueChange={this.fieldTypeValueChangeHandler}
            cancelChanges={this.cancelFieldTypeChanges}
          />
        ) : (
          <FieldTypesPanel
            fieldTypes={fieldTypes}
            isPanelOpen={isFieldTypesPanelOpen}
            onClose={this.closeFieldTypesPanel}
          />
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
          {TRIAL_SETS === formType ? (
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
          <Box
            display="flex"
            alignItems="center"
            className={classes.attributesHeadlineWrapper}
          >
            <CustomHeadline
              className={classes.attributesHeadline}
              title="Attributes"
              description="Drag fields from the right bar"
              titleFontSize={18}
              descriptionFontSize={16}
              titleColor={theme.palette.black.main}
              descriptionColor={theme.palette.gray.dark}
            />
            <SimpleButton
              variant="outlined"
              colorVariant="primary"
              className={classes.addButton}
              onClick={this.openFieldTypesPanel}
              text="Add"
              size="small"
              disabled={isEditModeEnabled || isFieldTypesPanelOpen || false}
            />
          </Box>
          <Droppable droppableId="droppable">
            {droppableProvided => (
              <div
                ref={droppableProvided.innerRef}
                className={dropZoneClassName}
              >
                {isEmpty(formObject.properties) ? (
                  <span>Drag and drop field types here to add</span>
                ) : (
                  formObject.properties.map((fieldType, index) => (
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
                            editedFieldTypeKey={editedFieldType.key}
                            isEditModeEnabled={isEditModeEnabled}
                            activateEditMode={this.activateEditMode}
                            cloneFieldType={() => this.cloneDraggedFieldType(fieldType)}
                            deleteFieldType={() => this.deleteDraggedFieldType(fieldType)}
                            fieldType={fieldType}
                            contentType={FIELD_TYPE_ITEM_INPUT_TYPE}
                            placeholder="Value"
                          />
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </form>
        {!isEditModeEnabled ? (
          <Footer
            cancelButtonHandler={() => history.push(`/experiments/${match.params.id}/${formType}`)}
            saveButtonHandler={() => this.submitEntity(this.state.formObject)}
          />
        ) : null}
      </DragDropContext>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles, { withTheme: true }),
)(AddSetForm);
