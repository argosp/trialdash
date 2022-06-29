import React, { useState } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { withStyles, Popover, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { styles } from './styles';
import { withRouter } from 'react-router-dom';
import Create from './create';
import List from './list'


function Labels({ classes, client, match, log, updateLabels }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [labelsState, setLabelsState] = useState('list')

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setLabelsState('list')
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={handleClick}>
          <SettingsIcon />
        </IconButton>
      </ListItemSecondaryAction>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{ paper: classes.popoverPaper }}
      >
        <>
          {labelsState === 'list' && <List log={log} setLabelsState={setLabelsState} handleClose={handleClose} updateLabels={updateLabels}/>}
          {labelsState === 'create' && <Create setLabelsState={setLabelsState} handleClose={handleClose}/>}
        </>
      </Popover>
    </>
  )
}

export default compose(
  withApollo,
  withRouter,
  withStyles(styles),
)(Labels);