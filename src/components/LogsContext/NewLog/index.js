import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { withStyles} from '@material-ui/core';
import { styles } from './styles';

import LogForm from '../LogForm'

function NewLog() {

  return (
    <>
        <LogForm submitBtnTxt="Submit new log"/>
    </>
  )
}

export default compose(
  withApollo,
  withRouter,
  withStyles(styles),
)(NewLog);