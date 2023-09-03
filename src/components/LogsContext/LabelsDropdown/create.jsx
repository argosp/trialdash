import React, { useState } from 'react';
import { withStyles, Grid, IconButton, Divider, TextField } from '@mui/material';
import SimpleButton from '../../SimpleButton';
import CloseIcon from '@mui/icons-material/Close';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { styles } from './styles';
import addUpdateLabel from '../utils/labelMutation';
import { withRouter } from 'react-router-dom';
import { updateCache } from '../../../apolloGraphql';
import labelsQuery from '../utils/labelsQuery'

const COLORS = [
  '#0048BA',
  '#B0BF1A',
  '#7CB9E8',
  '#C0E8D5',
  '#B284BE',
  '#72A0C1',
  '#3B7A57',
  '#FFBF00',
  '#F0F8FF',
  '#C46210',
  '#EFDECD',
  '#E52B50',
  '#9F2B68',
  '#F19CBB',
  '#FF7E00'
]
function Create({ classes, client, match, setLabelsState, handleClose, label={name: ''} }) {
  const [labelName, setLabelName] = useState(label.name);
  const [color, setColor] = useState(label.color);

  function createLabel() {
    client.mutate({
      mutation: addUpdateLabel(match.params.id, {name: labelName, color, key: label.key}),
      update: (cache, mutationResult) => {
        updateCache(
          cache,
          mutationResult,
          labelsQuery(match.params.id),
          'labels',
          'addUpdateLabel'
        );
      },
    }).then(data => {
      setLabelsState('list')
    })
  }
  return (
    <>
      <div className={classes.dropdownTitle}>
        <span className={classes.dropdownTitleSpan}>{`${label.key ? 'Edit Label' : 'Create Label'}`}</span>
        <IconButton classes={{root: classes.dropdownClose}} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <Divider classes={{ root: classes.divider }} />
      <TextField classes={{ root: classes.dropdownInput }} label="Name new label" variant="outlined" value={labelName} onChange={(e) => setLabelName(e.target.value)} />
      <Grid container classes={{ root: classes.suggestColors }}>
        {COLORS.map(c =>
          <div
            className={`${classes.suggestColorsTile} ${color === c ? classes.selectedSuggestColorsTile : ''}`}
            onClick={() => setColor(c)}
            style={{ backgroundColor: c }}>
          </div>
        )}
      </Grid>
      <Grid container justifyContent="space-between" classes={{ root: classes.dropdownActions }}>
        <SimpleButton
          variant="outlined"
          onClick={createLabel}
          text={`${label.key ? 'Update' : 'Create'}`}
          size="small"
          disabled={!labelName || !color}
        />
        <SimpleButton
          variant="outlined"
          onClick={() => setLabelsState('list')}
          text="Cancel"
          size="small"
        />
      </Grid>

    </>

  )
}

export default compose(
  withApollo,
  withRouter,
  withStyles(styles),
)(Create);