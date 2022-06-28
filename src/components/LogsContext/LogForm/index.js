import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { withStyles, Paper, Grid, TextField, List, ListItem, ListItemText, IconButton, ListItemSecondaryAction, Typography } from '@material-ui/core';
import { styles } from './styles';
import addUpdateLog from '../utils/logMutation';
import SimpleButton from '../../SimpleButton';
import MDEditor from '@uiw/react-md-editor';
import FileUpload from './fileUpload';
import getDate from '../utils/getDate';
import Labels from '../LabelsDropdown';

function LogForm({ classes, client, match, submitBtnTxt, log = {} }) {

  const [logValues, setLogValues] = useState({ comment: '', ...log })

  function handleChange(field, value) {
    setLogValues(prev => ({
      ...prev,
      [field]: value
    }))
  }

  function handleSubmit() {
    client.mutate({
      mutation: addUpdateLog(match.params.id, logValues)
    });
  }

  function addImage(img) {
    handleChange('comment', `${logValues.comment} ${img}`)
  }


  return (
    <Grid container>
      <Grid item xs={9}>
        <Paper classes={{ root: classes.paper }}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={logValues.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </Paper>
        <Paper classes={{ root: classes.paper }}>
          <div className={classes.wrapperEditor}>
            <MDEditor
              className={classes.mdEditor}
              value={logValues.comment}
              onChange={(val) => handleChange('comment', val)}
            />
            <FileUpload classes={classes} client={client} addImage={addImage} />
          </div>
        </Paper>
        {logValues.updated && <Paper classes={{ root: classes.paper }}>
          <Typography variant='subtitle1'><strong>{logValues.creator}</strong> updated this log on {getDate(log.updated)}</Typography>
        </Paper>}
        <Paper classes={{ root: classes.paper }}>
          <Grid container direction="row" justifyContent="flex-end">
            <SimpleButton
              colorVariant="primary"
              text={submitBtnTxt}
              disabled={!logValues.title}
              onClick={handleSubmit}
            />
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={3}>
        <List>
          <ListItem alignItems="flex-start">
            <ListItemText
              primary="Labels"
              secondary={
                <>
                  None yet
                </>
              }
            />
            <Labels/>
          </ListItem>
        </List>

      </Grid>
    </Grid>
  )
}

export default compose(
  withApollo,
  withRouter,
  withStyles(styles),
)(LogForm);