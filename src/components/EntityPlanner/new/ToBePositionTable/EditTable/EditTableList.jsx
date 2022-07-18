import React from 'react'
import { Draggable } from 'react-beautiful-dnd';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import SearchBar from '../SearchInput'
import EditTableListRow from './EditTableListRow'

const Container = ({ classes, children }) => <section className={classes}>{children}</section>

const Pane = ({ align, classes, children }) => <div style={{ textAlign: align }} className={classes}>{children}</div>

function EditTableList({ entities, classes }) {

  const devicestypes = entities.reduce((prev, current) => [...prev, ...current.properties], [])


  return (
    <Container classes={classes.list}>

      <Pane>
        <SearchBar withBorder />
      </Pane>

      <Pane classes={classes.row}>

        <div className={classes.flexItemEx} />

        {
          ['positioned', 'not positioned'].map(text => (
            <div align="center" className={classes.flexItem1} >
              <Typography variant="overline" className={classes.colText}>
                {text}
              </Typography>
            </div>
          ))
        }

      </Pane>
      <Pane>
        <List className={classes.deviceTypesList}>
          

          {
            devicestypes.map(deviceProps => (
              <EditTableListRow classes={classes} deviceProps={deviceProps} />
              ))}
          
        </List>
      </Pane>
    </Container>
  )
}

export default EditTableList