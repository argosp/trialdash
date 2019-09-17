import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import React from 'react';
import { withStyles } from '@material-ui/core';
import { styles } from './styles';

const ContentHeader = (props) => {
  const {
    classes,
    title,
    searchPlaceholder,
    addButtonText,
    withBackButton,
    backButtonHandler,
    rightDescription,
    addButtonHandler,
    bottomDescription,
    withSearchInput,
  } = props;

  return (
    <Grid container justify="space-between" className={classes.header}>
      <div>
        {withBackButton ? (
          <KeyboardBackspaceIcon
            className={classes.backIcon}
            onClick={backButtonHandler}
          />
        ) : null}
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
          <Button
            variant="contained"
            color="primary"
            className={classes.addButton}
            onClick={addButtonHandler}
          >
            {addButtonText}
          </Button>
        </div>
      ) : null}
    </Grid>
  );
};

export default withStyles(styles)(ContentHeader);
