import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { withStyles, Grid, List, ListItem, ListItemText } from '@material-ui/core';
import { styles } from './styles';
import logsQuery from '../utils/logsQuery';
import SimpleButton from '../../SimpleButton';
import { LOGS_DASH } from '../../../constants/base';
import getDate  from '../utils/getDate';

function Logs({ match, client, classes }) {
  const [rows, setRows] = useState([])

  useEffect(() => {
    const experimentId = match.params.id
    client
      .query({ query: logsQuery(experimentId) })
      .then((data) => {
        if (data && data.data && data.data.logs) {
          setRows(data.data.logs)
        }
      });
  }, [])

  return (
    <>
      <Grid container direction="row" justifyContent="flex-end">
        <SimpleButton
          colorVariant="primary"
          text="New log"
          href={`/experiments/${match.params.id}/${LOGS_DASH}/new`}
        />
      </Grid>
        <List>
          {rows.map(r =>
            <ListItem button component="a" href={`/experiments/${match.params.id}/${LOGS_DASH}/${r.key}`} classes={{root: classes.listItem}}>
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