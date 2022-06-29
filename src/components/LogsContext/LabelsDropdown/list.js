import React, { useState, useEffect } from 'react';
import { withStyles, Grid, Checkbox, ListItemSecondaryAction, IconButton, List, ListItem, ListItemText, Divider, ListItemIcon } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { styles } from './styles';
import { withRouter } from 'react-router-dom';
import labelsQuery from '../utils/labelsQuery';
import addUpdateLog from '../utils/logMutation';
import { BasketIcon, PenIcon } from '../../../constants/icons';

function LabelRow({ label }) {
  return (
    <Grid container>
      <i style={{ display: 'inline-block', marginRight: 5, borderRadius: '50%', backgroundColor: label.color, width: 20, height: 20 }}></i>
      <span>{label.name}</span>
    </Grid>
  )
}


function LabelsList({ classes, client, match, setLabelsState, handleClose, log, updateLabels, handleEdit }) {

  const [labels, setLabels] = useState([])
  const [checked, setChecked] = React.useState((log.labels && log.labels.map(q => q.key)) || []);
  const labelsObj = labels.reduce((obj, item) => Object.assign(obj, { [item.key]: { ...item } }), {});

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


  function handleToggle(value) {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    if (log.key) {
      client.mutate({
        mutation: addUpdateLog(match.params.id, { ...log, labels: newChecked })
      });
    }

    updateLabels(newChecked.map(q => ({ ...labelsObj[q] })))
  }

  return (
    <>
      <div className={classes.dropdownTitle}>
        <span className={classes.dropdownTitleSpan}>Assign label</span>
        <IconButton classes={{ root: classes.dropdownClose }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <Divider classes={{ root: classes.divider }} />
      <div className={classes.dropdownContent}>
        <List>
          {labels.map(l =>
            <ListItem key={l.key} role={undefined} dense button onClick={() => handleToggle(l.key)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(l.key) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={<LabelRow label={l} />} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(l)}>
                   <PenIcon />
                 </IconButton>
              </ListItemSecondaryAction>
            </ListItem>)}
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