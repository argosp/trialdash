import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { withStyles, Paper, Grid, TextField, List, ListItem, ListItemText, Chip, Typography, IconButton } from '@mui/material';
import { styles } from './styles';
import addUpdateLog from '../utils/logMutation';
import SimpleButton from '../../SimpleButton';
// import MDEditor from '@uiw/react-md-editor';
import FileUpload from './fileUpload';
import getDate from '../utils/getDate';
import Labels from '../LabelsDropdown';
import SettingsIcon from '@mui/icons-material/Settings';
import { DatePicker } from '@material-ui/pickers';

function LogForm({ classes, client, match, submitBtnTxt, log = {} }) {

  const [logValues, setLogValues] = useState({ comment: '', title: '', ...log })
  const [isOpen, setIsOpen] = useState(false);

  function handleChange(field, value) {
    const newValue ={...logValues, [field]: value}
    setLogValues(newValue)
    return newValue
  }

  async function handleSubmit() {
    await client.mutate({
      mutation: addUpdateLog(match.params.id, logValues)
    });
    window.location.href = `/experiments/${match.params.id}/logs`
  }

  function addImage(img) {
    handleChange('comment', `${logValues.comment} ${img}`)
  }

  function updateLabels(checked) {
    handleChange('labels', checked)
  }

  function handleDateChange(val) {
    const newValues =  handleChange('startDate', val.toISOString())
    client.mutate({
      mutation: addUpdateLog(match.params.id, newValues)
    });
  }


  return (
    <Grid container justifyContent="space-between" spacing={5}>
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
            {/* <MDEditor
              className={classes.mdEditor}
              value={logValues.comment}
              onChange={(val) => handleChange('comment', val)}
            /> */}
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
        <Paper>
          <List>
            <ListItem classes={{ root: classes.sideListItem }} alignItems="flex-start">
              <ListItemText
                primary="Labels"
                secondary={
                  <span>
                    {logValues.labels && logValues.labels.length ?
                      logValues.labels.map(q => <Chip component="span" key={q.name} classes={{ root: classes.labelChip }} style={{ backgroundColor: q.color }} label={q.name} />)
                      :
                      <span>None yet</span>
                    }

                  </span>
                }
              />
              <Labels log={logValues} updateLabels={updateLabels} />
            </ListItem>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="Set start date"
                secondary={
                  logValues.startDate && getDate(logValues.startDate)
                }
              />
              <IconButton edge="end" aria-label="delete" onClick={() => setIsOpen(true)}>
                <SettingsIcon />
              </IconButton>
              <DatePicker
                className={classes.datePickerInput}
                variant="inline"
                open={isOpen}
                autoOk
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                value={logValues.startDate}
                onChange={handleDateChange}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default compose(
  withApollo,
  withRouter,
  withStyles(styles),
)(LogForm);