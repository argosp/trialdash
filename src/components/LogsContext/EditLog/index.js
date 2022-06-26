import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { withStyles, Typography, Divider, Grid } from '@material-ui/core';
import { styles } from './styles';
import logQuery from '../utils/logQuery';
import getDate from '../utils/getDate';
import LogForm from '../LogForm';
import { LOGS_DASH } from '../../../constants/base';
import SimpleButton from '../../SimpleButton'

function EditLog({ client, match, classes }) {

  const [log, setLog] = useState()

  useEffect(() => {
    const experimentId = match.params.id
    const logKey = match.params.logKey
    client
      .query({ query: logQuery(experimentId, logKey) })
      .then((data) => {
        if (data && data.data && data.data.log) {
          setLog({ ...data.data.log, comment: fixNewLineSymbol(data.data.log.comment) })
        }
      });
  }, [])
  function fixNewLineSymbol(comment) {
    const split = comment.split("\\n")
    return split.join(`
        `)
  }

  return (
    log ? <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid itemRef=''>
          <Typography variant='h4'>{log.title}</Typography>
          <Typography variant='subtitle1'><strong>{log.creator}</strong> opened this log on {getDate(log.created)}</Typography>
        </Grid>
        <Grid item>
          <SimpleButton
            colorVariant="primary"
            text="New log"
            href={`/experiments/${match.params.id}/${LOGS_DASH}/new`}
          />
        </Grid>
      </Grid>

      <Divider className={classes.divider} />
      <LogForm submitBtnTxt="Update" log={log} />
    </> : <></>
  )
}

export default compose(
  withApollo,
  withRouter,
  withStyles(styles),
)(EditLog);