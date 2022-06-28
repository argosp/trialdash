import React, { useState } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { withStyles, Popover, IconButton, ListItemSecondaryAction, ListItem, ListItemText, Divider, TextField, Typography } from '@material-ui/core';
import SimpleButton from '../../SimpleButton'
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { styles } from './styles';
import addUpdateLabel from '../utils/labelMutation';
import { withRouter } from 'react-router-dom';


function Labels({ classes, client, match }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [labelsState, setLabelsState] = useState('list')
  const [labelName, setLabelName] = useState('')

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setLabelsState('list')
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  function createLabel() {
    client.mutate({
      mutation: addUpdateLabel(match.params.id, labelName)
    });
  }
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
      >
        <>
          {labelsState === 'list' && <Typography align="center">Assign labels</Typography>}
          {labelsState === 'create' && <Typography align="center">Create label</Typography>}
          <Divider classes={{ root: classes.labelsDivider }} />
          {labelsState === 'list' && <div>
            <ListItem button component="a" onClick={() => setLabelsState('create')}>
              <ListItemText>Create label</ListItemText>
            </ListItem>
          </div>}
          {labelsState === 'create' && <div>
            <TextField label="Name new label" variant="outlined" value={labelName} onChange={(e) => setLabelName(e.target.value)} />

            <SimpleButton
              variant="outlined"
              onClick={createLabel}
              text="Create"
              size="small"
              disabled={!labelName}
            />
          </div>}
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