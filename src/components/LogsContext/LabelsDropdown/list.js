import React, { useState, useEffect } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { withStyles, Popover, IconButton, List, ListItem, ListItemText, Divider, TextField, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { styles } from './styles';
import addUpdateLabel from '../utils/labelMutation';
import { withRouter } from 'react-router-dom';
import labelsQuery from '../utils/labelsQuery';


function LabelsList({ classes, client, match, setLabelsState, handleClose }) {

  const [labels, setLabels] = useState([])

  useEffect(() => {
    const experimentId = match.params.id
    client
      .query({ query: labelsQuery(experimentId) })
      .then((data) => {
        if (data && data.data && data.data.labels) {
          setLabels(data.data.labels)
        }
      });
  }, [])

  return (
    <>
      <div className={classes.dropdownTitle}>
        <span className={classes.dropdownTitleSpan}>Assign label</span>
        <IconButton classes={{root: classes.dropdownClose}} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <Divider classes={{ root: classes.divider }} />
      <div className={classes.dropdownContent}>
        <List>
          {labels.map(l => <ListItem button>
            <span className={classes.listColor} style={{backgroundColor: l.color}}></span>{l.name}</ListItem>)}
        </List>
      </div>
      <Divider classes={{ root: classes.divider }} />
      <div>
        <List>
          <ListItem button component="a" onClick={() => setLabelsState('create')}>
            <ListItemText>Create label</ListItemText>
          </ListItem>
        </List>
      </div>
    </>

  )
}

export default compose(
  withApollo,
  withRouter,
  withStyles(styles),
)(LabelsList);