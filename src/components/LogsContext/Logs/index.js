import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import moment from 'moment';
import { withApollo } from 'react-apollo';
import { withStyles, Grid, List, ListItem, ListItemText, Paper } from '@material-ui/core';
import { styles } from './styles';
import logsQuery from '../utils/logsQuery';
import labelsQuery from '../utils/labelsQuery';
import SimpleButton from '../../SimpleButton';
import { LOGS_DASH } from '../../../constants/base';
import getDate from '../utils/getDate';
import { DatePicker } from "@material-ui/pickers";
import ContentHeader from '../../ContentHeader';

function Logs({ match, client, classes, history }) {
  const [rows, setRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([])
  const [selectedDate, handleDateChange] = useState(null);
  const [labels, setLabels] = useState([])

  useEffect(() => {
    const experimentId = match.params.id
    client
      .query({ query: logsQuery(experimentId) })
      .then((data) => {
        if (data && data.data && data.data.logs) {
          setRows(data.data.logs)
          setFilteredRows(data.data.logs)
        }
      });
    client
      .query({ query: labelsQuery(experimentId) })
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
        <Grid container justifyContent="flex-end">
          <DatePicker
            label="created since"
            value={selectedDate}
            inputVariant="outlined"
            onChange={handleDateChange}
            clearable={true}
          />
        </Grid>

      </Paper>
      <List>
        {filteredRows.map(r =>
          <ListItem button component="a" href={`/experiments/${match.params.id}/${LOGS_DASH}/${r.key}`} classes={{ root: classes.listItem }}>
            <ListItemText primary={r.title} secondary={`Opened on ${getDate(r.created)}`} />
          </ListItem>
        )}
      </List>
    </>
  )
}

export default compose(
  withApollo,
  withRouter,
  withStyles(styles),
)(Logs);