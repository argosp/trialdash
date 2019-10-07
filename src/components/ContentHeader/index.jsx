import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import React from 'react';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core';
import { styles } from './styles';
import SimpleButton from '../SimpleButton';

const ContentHeader = (props) => {
  const {
    classes,
    title,
    searchPlaceholder,
    addButtonText,
    withBackButton,
    backButtonHandler,
    topDescription,
    rightDescription,
    addButtonHandler,
    bottomDescription,
    withSearchInput,
    className,
  } = props;

  return (
    <Grid container justify="space-between" className={classnames(classes.header, className)}>
      <div>
        {withBackButton ? (
          <KeyboardBackspaceIcon
            className={classes.backIcon}
            onClick={backButtonHandler}
          />
        ) : null}
        {topDescription ? <p className={classes.topDescription}>{topDescription}</p> : null}
        <h1 className={classes.title}>{title}</h1>
        {rightDescription ? (
          <span className={classes.rightDescription}>{rightDescription}</span>
        ) : null}
        {bottomDescription ? (
          <p className={classes.bottomDescription}>{bottomDescription}</p>
        ) : null}
      </div>
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
            }}
            inputProps={{ 'aria-label': searchPlaceholder }}
          />
          <SimpleButton
            colorVariant="primary"
            className={classes.addButton}
            text={addButtonText}
            onClick={addButtonHandler}
          />
        </div>
      ) : null}
    </Grid>
  );
};

export default withStyles(styles)(ContentHeader);
