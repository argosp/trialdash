/* eslint-disable arrow-body-style */
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
  ENTITIES_TYPES_DASH,
  TRIAL_SETS_DASH,
} from '../../constants/base';
import FieldTypesPanel from '../FieldTypesPanel';
import entitiesTypeMutation from '../EntityContext/utils/entitiesTypeMutation';
import {
  FIELD_TYPES,
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
import ConfirmDialog from '../ConfirmDialog';

class AddSetForm extends React.Component {

  initFormObject = () => {
    return ENTITIES_TYPES_DASH === this.props.formType ? {
      key: this.props.entitiesType ? this.props.entitiesType.key : uuid(),
      name: this.props.entitiesType ? this.props.entitiesType.name : '',
      experimentId: this.props.match.params.id,
      numberOfEntities: this.props.entitiesType ? this.props.entitiesType.numberOfEntities : 0,
      properties: this.props.entitiesType ? this.props.entitiesType.properties : [{
        description: 'a short description of the field',
        prefix: '',
        suffix: '',
        template: '',
        trialField: true,
        key: uuid(),
        label: 'Location',
        name: 'Location',
        type: 'location',
        defaultProperty: true,
      }], // this field correspond to the <Droppable droppableId="droppable">
    }
      : {
        key: this.props.trialSet ? this.props.trialSet.key : uuid(),
        name: this.props.trialSet ? this.props.trialSet.name : '',
        description: this.props.trialSet ? this.props.trialSet.description : '',
        experimentId: this.props.match.params.id,
        numberOfTrials: this.props.trialSet ? this.props.trialSet.numberOfTrials : 0,
        properties: this.props.trialSet ? this.props.trialSet.properties : [], // this field correspond to the <Droppable droppableId="droppable">
      }

  }
  state = {
    formObject: this.initFormObject(),


    // this field correspond to the <Droppable droppableId="droppable2">
    fieldTypes: FIELD_TYPES_ARRAY,
    isEditModeEnabled: false,
    isDragDisabled: false,
    editedFieldType: {}, // used to cancel changes of a field type
    isDragging: false,
    isFieldTypesPanelOpen: true,
    isEditFieldTypePanelOpen: false,
  };

  closeForm = () => {
    if (this.props.returnFunc) this.props.returnFunc(true);
    else this.props.history.push(`/experiments/${this.props.match.params.id}/${this.props.formType}`);
  }

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
    } else {
      value = e.target.checked;
      if (property === 'defaultValue') value = e.target.checked.toString();
    }

    this.setState(state => ({
      formObject: {
        ...state.formObject,
        properties: state.formObject.properties.map(fieldType => (fieldType.key === fieldTypeKey
          ? { ...fieldType, [property]: value }
          : fieldType)),
      },
      changed: true
    }));
  };
  updateAfterSubmit = (n, cache, trialset) => {
    this.props.updateTrialset(trialset)
  }

  submitEntity = async (entity, deleted) => {
    const newEntity = entity;
    if (deleted) newEntity.state = 'Deleted';
    const { formType, match, client, cacheQuery, itemsName, mutationName, returnFunc } = this.props;
    newEntity.properties.forEach((p) => {
      delete p.fields;
      delete p.name;
      if (ENTITIES_TYPES_DASH !== formType) {
        delete p.prefix;
        delete p.suffix;
        delete p.trialField;
      }
    });
    // add number of field types to the Entities type
    if (ENTITIES_TYPES_DASH === formType) {
      newEntity.numberOfFields = this.state.formObject.properties.length;
    }

    const mutation = ENTITIES_TYPES_DASH === formType
      ? entitiesTypeMutation
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
            returnFunc,
            'trialsetKey',
            this.updateAfterSubmit
          );
        },
      });

    this.setState({ changed: false })

    // if (returnFunc) returnFunc(true);
    // else history.push(`/experiments/${match.params.id}/${formType}`);
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
        changed: true
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
        changed: true
      }));
    }
  };

  inputChangeHandler = (e, type) => {
    const { value } = e.target;

    this.setState(state => ({
      formObject: { ...state.formObject, [type]: value },
      changed: true
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
      changed: true
    }));
  };
  cancelHandler = () => {
    this.setState({
      formObject: this.initFormObject(),
      changed: false
    })
  }

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

  setConfirmOpen = (open) => {
    this.setState({ confirmOpen: open });
  }

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
      confirmOpen,
    } = this.state;
    const { classes, theme, formType } = this.props;
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
            // eslint-disable-next-line no-nested-ternary
            ENTITIES_TYPES_DASH === formType
              ? this.props.entitiesType ? 'Edit entities type' : 'Add entities type'
              : this.props.trialSet ? 'Edit trial set' : 'Add trial set'
          }
          bottomDescription="a short description of what it means to add an item here"
          backButtonHandler={this.closeForm}
          withBackButton
        />
        {isEditModeEnabled ? (
          <EditFieldTypePanel
            isPanelOpen={isEditFieldTypePanelOpen}
            deactivateEditMode={this.deactivateEditMode}
            fieldType={Object.assign(FIELD_TYPES[editedFieldType.type], formObject.properties.find(
              fieldType => fieldType.key === editedFieldType.key,
            ))}
            onValueChange={this.fieldTypeValueChangeHandler}
            cancelChanges={this.cancelFieldTypeChanges}
            formType={formType}
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
                value={this.state.formObject.name}
              />
            </Grid>
          </Grid>
          {TRIAL_SETS_DASH === formType ? (
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <CustomInput
                  onChange={e => this.inputChangeHandler(e, 'description')}
                  id="entity-description"
                  label="Description"
                  bottomDescription="a short description"
                  value={this.state.formObject.description}
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
                            placeholder="Default Value"
                            defaultValue={editedFieldType.defaultValue}
                            onValueChange={this.fieldTypeValueChangeHandler}
                            value={editedFieldType.value}
                            multiple={editedFieldType.multipleValues}
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
            saveButtonHandler={() => this.submitEntity(this.state.formObject)}
            withDeleteButton={this.props.entitiesType || false}
            deleteButtonHandler={() => this.submitEntity(this.state.formObject, true)}
            cancelButtonHandler={this.cancelHandler}
            saveButtonDisabled={!this.state.changed}
            cancelButtonDisabled={!this.state.changed}
          />
        ) : null}
        <ConfirmDialog
          title={`Delete ${ENTITIES_TYPES_DASH === formType ? 'Entities Type' : 'Trial Set'}`}
          open={confirmOpen}
          setOpen={this.setConfirmOpen}
          onConfirm={() => this.submitEntity(this.state.formObject, true)}
          inputValidation
        >
          Are you sure you want to delete this {ENTITIES_TYPES_DASH === formType ? 'entities type' : 'trial set'}?
        </ConfirmDialog>
      </DragDropContext>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles, { withTheme: true }),
)(AddSetForm);
