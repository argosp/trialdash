import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { styles } from './styles';
import ContentHeader from '../ContentHeader';
import CustomInput from '../CustomInput';
import CustomHeadline from '../CustomHeadline';
import AttributeItem from '../AttributeItem';
import Footer from '../Footer';
import {
  ATTRIBUTE_ITEM_CHECKBOX_TYPE,
  ATTRIBUTE_ITEM_INPUT_TYPE,
  ATTRIBUTE_ITEM_RADIO_TYPE,
} from '../../constants/attributes';

class AddForm extends React.Component {
  state = this.props.initialState;

  inputChangeHandler = (e, type) => {
    this.setState({ [type]: e.target.value });
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
          <AttributeItem
            fieldType="text"
            contentType={ATTRIBUTE_ITEM_INPUT_TYPE}
            title="Release type"
            inputId="attribute-item-1"
            placeholder="enter sku here"
            description="a short description of the field"
          />
          <AttributeItem
            fieldType="selectList"
            contentType={ATTRIBUTE_ITEM_CHECKBOX_TYPE}
            title="Type"
            inputId="attribute-item-2"
            description="a short description of the field"
          />
          <AttributeItem
            fieldType="selectList"
            contentType={ATTRIBUTE_ITEM_RADIO_TYPE}
            title="Type"
            inputId="attribute-item-3"
            description="a short description of the field"
          />
        </form>
        {withFooter ? (
          <Footer
            cancelButtonHandler={cancelFormHandler}
            saveButtonHandler={() => saveFormHandler(this.state)}
          />
        ) : null}
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AddForm);
