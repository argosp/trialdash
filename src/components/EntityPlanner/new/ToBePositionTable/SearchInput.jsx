import React from 'react'
import InputBase from '@material-ui/core/InputBase';

import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({

  search: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#FDFDFD',
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    [theme.breakpoints.up('sm')]: {
      // marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 1, 0, 0),
    height: '100%',
    pointerEvents: 'none',
    display: 'flex'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    width: '100%',

  },
}));

const SearchInput = ({ withBorder, onSearch = () => { }}) => {
  const borderClass = withBorder ? {
    border: '1px solid #E0E0E0',
    borderRadius: 5,
    paddingLeft: 12
  } : {};

  const classes = useStyles();

  return (
    <div className={classes.search + " tbpRow"} style={borderClass}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
        onChange={ e => onSearch(e.target.value)}
      />
    </div>
  )
}

export default SearchInput