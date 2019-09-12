import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { withStyles } from '@material-ui/core';
import { styles } from './styles';

class ContentHeader extends React.Component {
  render() {
    const { classes, title, searchPlaceholder, addButtonText } = this.props;

    return (
      <Grid container justify="space-between" className={classes.header}>
        <h1 className={classes.title}>{title}</h1>
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
          >
            {addButtonText}
          </Button>
        </div>
      </Grid>
    );
  }
}

export default withStyles(styles)(ContentHeader);
