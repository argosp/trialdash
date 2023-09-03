import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { withStyles } from '@mui/styles';
import { styles } from './styles';
import ContentHeader from '../../ContentHeader';

import LogForm from '../LogForm'

function NewLog({history, match}) {

  return (
    <>
      <ContentHeader
        title="New Log"
        withBackButton
        backButtonHandler={() => history.push(`/experiments/${match.params.id}/logs`)}
      />
      <LogForm submitBtnTxt="Submit new log" />
    </>
  )
}

export default compose(
  withApollo,
  withRouter,
  withStyles(styles),
)(NewLog);