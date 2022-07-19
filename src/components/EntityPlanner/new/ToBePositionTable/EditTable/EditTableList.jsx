import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import SearchBar from '../SearchInput'
import EditTableListRow from './EditTableListRow'
// import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddBoxIcon from '@material-ui/icons/AddBox';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import { Divider, IconButton, ListItemSecondaryAction } from '@material-ui/core';

const Container = ({ classes, children }) => <section className={classes}>{children}</section>

const Pane = ({ align, classes, children }) => <div style={{ textAlign: align }} className={classes}>{children}</div>

function EditTableList({ entities, classes }) {

  const devicesTypes = entities.reduce((prev, current) => [...prev, ...current.properties], [])


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
          <Droppable droppableId="droppable">
            {droppableProvided => (
              <div
                ref={droppableProvided.innerRef}
                className={'dropZoneClassName'}
              >
                {
                  devicesTypes.map((deviceProps, index) =>
                  (
                    <EditTableListRow classes={classes} deviceProps={deviceProps}>
                      <Draggable key={deviceProps.key} draggableId={deviceProps.key} index={index}>

                        {
                          draggableProvided => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                            >

                              <List className={classes.list} component="div" disablePadding>

                                <ListItem button className={classes.nested}>
                                  <ListItemText primary={deviceProps.type} />
                                  <ListItemText secondary="50cm" />
                                  <ListItemText secondary="Samsung" />
                                  <ListItemText secondary="blabla23" />
                                  <ListItemText secondary="20kg" />
                                  <IconButton className={classes.iconButton}>
                                    <LocationOnOutlinedIcon />
                                  </IconButton>

                                  <ListItemSecondaryAction className={classes.addIconWrapper}>
                                    <IconButton className={classes.iconButton}>
                                      <AddBoxIcon fontSize="large" color="primary" />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                </ListItem>

                              </List>
                            </div>
                          )}
                      </Draggable>
                    </EditTableListRow>
                  ))
                }
              </div>
            )}
          </Droppable>
        </List>
      </Pane>
    </Container>
  )
}

export default EditTableList