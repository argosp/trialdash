import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import React from 'react';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { styles } from './styles';
import SimpleButton from '../SimpleButton';

const ContentHeader = (props) => {
  const {
    classes,
    title,
    searchPlaceholder,
    withAddButton,
    addButtonText,
    withUploadButton,
    uploadButtonText,
    withBackButton,
    backButtonHandler,
    topDescription,
    rightDescription,
    middleDescription,
    addButtonHandler,
    uploadButtonHandler,
    bottomDescription,
    withSearchInput,
    className,
    rightComponent,
    onClick,
    withDeleteButton,
    deleteButtonHandler,
    deleteButtonText,
    withAddMultipleButton,
    addMultipleButtonText,
    addMultipleButtonHandler,
  } = props;

  return (
    <Grid container justify="space-between" className={classnames(classes.header, className)} onClick={onClick}>
      <Box
        display="flex"
        alignItems="center"
      >
        {withBackButton ? (
          <KeyboardBackspaceIcon
            className={classes.backIcon}
            onClick={backButtonHandler}
          />
        ) : null}
        
        <Box display="inline-block">
          <Box display="inline-block">
            {topDescription ? <p className={classes.topDescription}>{topDescription}</p> : null}
            <h1 className={classes.title}>{title}</h1>
          </Box>
          {rightDescription ? (
            <div className={classes.rightDescription}>{rightDescription}</div>
          ) : null}
          {bottomDescription ? (
            <div className={classes.bottomDescription}>{bottomDescription}</div>
          ) : null}
        </Box>
        {middleDescription ? (
            <div className={classes.middleDescription}>{middleDescription}</div>
          ) : null}
      </Box>
      
      {withSearchInput ? (
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder={searchPlaceholder}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
              focused: classes.inputFocused,
            }}
            inputProps={{ 'aria-label': searchPlaceholder }}
          />
          {withAddButton
            && (
              <SimpleButton
                colorVariant="primary"
                className={classes.addButton}
                text={addButtonText}
                onClick={addButtonHandler}
              />
            )
          }
          {withUploadButton
            && (
              <SimpleButton
                colorVariant="primary"
                className={classes.addButton}
                component="label"
                text={
                  <>
                  {uploadButtonText}
                  <input
                    type="file"
                    onChange={uploadButtonHandler}
                    hidden
                  /></>}
              />
            )
          }
          {withDeleteButton
            && (
              <SimpleButton
                colorVariant="secondary"
                className={classes.addButton}
                text={deleteButtonText}
                onClick={deleteButtonHandler}
              />
            )
          }
          {withAddMultipleButton
            && (
              <SimpleButton
                colorVariant="primary"
                className={classes.addButton}
                text={addMultipleButtonText}
                onClick={addMultipleButtonHandler}
              />
            )
          }
        </div>
      ) : rightComponent}
    </Grid>
  );
};

export default withStyles(styles)(ContentHeader);
