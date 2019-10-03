import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { styles } from './styles';
import ContentHeader from '../ContentHeader';
import CustomInput from '../CustomInput';
import CustomHeadline from '../CustomHeadline';
import AttributeItem from '../AttributeItem';
import Footer from '../Footer';
import {
  ATTRIBUTE_ITEM_INPUT_TYPE,
} from '../../constants/attributes';

class AddForm extends React.Component {
  state = {
    formObject: this.props.initialValues,
  };

  inputChangeHandler = (e, type) => {
    const { value } = e.target;

    this.setState(state => ({ formObject: { ...state.formObject, [type]: value } }));
  };

  render() {
    const {
      classes,
      theme,
      headerTitle,
      headerDescription,
      cancelFormHandler,
      saveFormHandler,
      commonInputs,
      descriptionInput,
      rightPanel,
      withFooter,
      selectedAttributes,
      changeAttributeValueHandler,
    } = this.props;

    return (
      <>
        <ContentHeader
          title={headerTitle}
          bottomDescription={headerDescription}
        />
        {rightPanel}
        <form className={classes.form}>
          <Grid container spacing={4}>
            {commonInputs.map(input => (
              <Grid item xs={3} key={input.key}>
                <CustomInput
                  onChange={e => this.inputChangeHandler(e, input.label.toLowerCase())}
                  id={input.id}
                  label={input.label}
                  bottomDescription={input.description}
                  placeholder={input.placeholder}
                />
              </Grid>
            ))}
          </Grid>
          {descriptionInput ? (
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <CustomInput
                  onChange={e => this.inputChangeHandler(e, descriptionInput.label.toLowerCase())}
                  id={descriptionInput.id}
                  label={descriptionInput.label}
                  bottomDescription={descriptionInput.description}
                  placeholder={descriptionInput.placeholder}
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
                {selectedAttributes.map((attribute, index) => (
                  <Draggable
                    key={attribute.key}
                    draggableId={attribute.key}
                    index={index}
                  >
                    {draggableProvided => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                      >
                        <AttributeItem
                          fieldType={attribute.type}
                          contentType={ATTRIBUTE_ITEM_INPUT_TYPE}
                          title={attribute.title}
                          inputId={attribute.key}
                          changeAttributeValueHandler={
                            event => changeAttributeValueHandler(event, attribute.key)
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
        {withFooter ? (
          <Footer
            cancelButtonHandler={cancelFormHandler}
            saveButtonHandler={() => saveFormHandler(this.state.formObject)}
          />
        ) : null}
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AddForm);
