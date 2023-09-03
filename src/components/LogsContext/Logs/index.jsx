import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import moment from 'moment';
import { withApollo } from 'react-apollo';
import { withStyles, Grid, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, Checkbox, Chip, MenuItem, FormControl, Select, InputLabel, Input } from '@mui/material';
import { styles } from './styles';
import logsQuery from '../utils/logsQuery';
import labelsQuery from '../utils/labelsQuery';
import SimpleButton from '../../SimpleButton';
import { LOGS_DASH } from '../../../constants/base';
import getDate from '../utils/getDate';
import { DatePicker } from "@material-ui/pickers";
import ContentHeader from '../../ContentHeader';
import { BasketIcon, PenIcon } from '../../../constants/icons';
import { updateCache } from '../../../apolloGraphql';
import ConfirmDialog from '../../ConfirmDialog';
import addUpdateLog from '../utils/logMutation';

function LabelRow({ label }) {
  return (
    <Grid container>
      <i style={{ display: 'inline-block', marginRight: 5, borderRadius: '50%', backgroundColor: label.color, width: 20, height: 20 }}></i>
      <span>{label.name}</span>
    </Grid>
  )
}

function Logs({ match, client, classes, history }) {
  const [rows, setRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([])
  const [selectedDate, handleDateChange] = useState(null);
  const [labels, setLabels] = useState([])
  const [selectedLabels, setSelectedLabels] = useState([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [logToDelete, setLogToDelete] = useState()

  function getLogs() {
    client
      .query({ query: logsQuery(match.params.id) })
      .then((data) => {
        if (data && data.data && data.data.logs) {
          setRows(data.data.logs)
          setFilteredRows(data.data.logs)
        }
      });
  }

  useEffect(() => {
    getLogs()
    client
      .query({ query: labelsQuery(match.params.id) })
      .then((data) => {
        if (data && data.data && data.data.labels) {
          setLabels(data.data.labels)
        }
      });
  }, [])

  useEffect(() => {

    function filterRows() {
      return rows.filter(w => moment(w.created).isSameOrAfter(selectedDate, 'day'))
    }
    selectedDate ? setFilteredRows(filterRows()) : setFilteredRows(rows)
  }, [selectedDate])

  useEffect(() => {

    function filterRows() {
      return rows.filter(w =>  w.labels.find(l => selectedLabels.find(s => s === l.key)))
    }
    selectedLabels.length ? setFilteredRows(filterRows()) : setFilteredRows(rows)
  }, [selectedLabels])

  const labelsObj = labels.reduce((obj, item) => Object.assign(obj, { [item.key]: { ...item } }), {});

  function handleDeleteClick(e, log) {
    e.preventDefault()
    setConfirmOpen(true)
    setLogToDelete(log)
  }
  function handleEditClick(e, log) {
    e.preventDefault()
    window.location.href = `/experiments/${match.params.id}/${LOGS_DASH}/${log.key}`
  }

  async function deleteLog() {

    await client
      .mutate({
        mutation: addUpdateLog(match.params.id, { ...logToDelete, state: 'Deleted' }),
        update: (cache, mutationResult) => {
          updateCache(
            cache,
            mutationResult,
            logsQuery(match.params.id),
            'logs',
            'addUpdateLog',
          );
        },
      });
      getLogs()
  }

  return (
    <>
      <ContentHeader
        title="Logs"
        withBackButton
        backButtonHandler={() => history.push('/experiments')}
      />
      <Grid container direction="row" justifyContent="flex-end">
        <SimpleButton
          colorVariant="primary"
          text="New log"
          href={`/experiments/${match.params.id}/${LOGS_DASH}/new`}
        />
      </Grid>
      <Paper classes={{ root: classes.filtersPaper }}>
        <Grid container justifyContent="flex-end" alignItems="baseline">
          <FormControl variant="outlined" classes={{ root: classes.filterLabelControl }}>
            <InputLabel id="filter-label">Label</InputLabel>
            <Select
              labelId="filter-label"
              multiple
              value={selectedLabels}
              onChange={(e) => setSelectedLabels(e.target.value)}
              input={<Input />}
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <Chip key={value} style={{ color: 'white', backgroundColor: labelsObj[value].color }} label={labelsObj[value].name} />
                  ))}
                </div>
              )}
            >
              {labels.map((l) => (
                <MenuItem key={l.name} value={l.key}>
                  <Checkbox checked={selectedLabels.indexOf(l.key) > -1} />
                  <ListItemText primary={<LabelRow label={l} />} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DatePicker
            label="Created since"
            value={selectedDate}
            onChange={handleDateChange}
            clearable={true}
          />
        </Grid>

      </Paper>
      <List>
        {filteredRows.map(r =>
          <ListItem key={r.key} button component="a" href={`/experiments/${match.params.id}/${LOGS_DASH}/${r.key}`} classes={{ root: classes.listItem }}>
            <ListItemText style={{flex: 'none'}} primary={r.title} secondary={`Opened on ${getDate(r.created)}`} />
            <div style={{marginLeft: 10}}>
            {r.labels && r.labels.map(q => <Chip component="span" key={q.name} style={{ backgroundColor: q.color, margin: '0 5px', color: 'white' }} label={q.name} />)}
              </div>
            <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit" onClick={(e) => handleEditClick(e, r)}>
                <PenIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteClick(e, r)}>
                <BasketIcon />
              </IconButton>

            </ListItemSecondaryAction>
          </ListItem>
        )}
        <ConfirmDialog
          title="Delete Log"
          open={confirmOpen}
          setOpen={setConfirmOpen}
          onConfirm={deleteLog}
        >
          Are you sure you want to delete this log?
        </ConfirmDialog>
      </List>


    </>
  )
}

export default compose(
  withApollo,
  withRouter,
  withStyles(styles),
)(Logs);