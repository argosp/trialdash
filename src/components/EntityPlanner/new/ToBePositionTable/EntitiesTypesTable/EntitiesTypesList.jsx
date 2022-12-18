import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { getEntityLocationProp } from '../../../EntityUtils';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import SearchBar from '../SearchInput';
import EntitiesTypesListRow from './EntitiesTypesListRow';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AddBoxIcon from '@material-ui/icons/AddBox';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import { IconButton, ListItemSecondaryAction } from '@material-ui/core';

const Container = ({ classes, children }) => <section className={classes}>{children}</section>;

const Pane = ({ align, classes, children }) => (
  <div style={{ textAlign: align }} className={classes}>
    {children}
  </div>
);

function EntitiesTypesList({
  entities: entitiesTypes,
  entitiesTypesInstances: entitiesList,
  classes,
  addEntityToTBPTable,
  removeEntityLocation,
}) {
  const handleRemoveEntityLocation = (entity) => {
    const parentEntity = entitiesTypes.find(({ key }) => key === entity.entitiesTypeKey);
    const childIndex = parentEntity.items.findIndex(({ key }) => key === entity.key);
    console.log(parentEntity.name, childIndex);
    removeEntityLocation(parentEntity.name, [childIndex]);
  };

  return (
    <Container classes={classes.list}>
      <Pane>
        <SearchBar withBorder />
      </Pane>

      <Pane classes={classes.row}>
        <div className={classes.flexItemEx} />

        {['positioned', 'not positioned'].map((text) => (
          <div key={text} align="center" className={classes.flexItem1}>
            <Typography variant="overline" className={classes.colText}>
              {text}
            </Typography>
          </div>
        ))}
      </Pane>
      <Pane>
        <List className={classes.deviceTypesList}>
          <Droppable droppableId="droppable">
            {(droppableProvided) => (
              <div ref={droppableProvided.innerRef} className={'dropZoneClassName'}>
                {entitiesTypes.map((entityType, index) => (
                  <EntitiesTypesListRow
                    key={entityType.key}
                    classes={classes}
                    entityType={entityType}>
                    {entitiesList.map((entity, entityIndex) => {
                      const prop = getEntityLocationProp(entity, entityType);
                      const entityLocation = prop && prop.val ? prop.val.coordinates : undefined;

                      if (entityType.key === entity.entitiesTypeKey)
                        return (
                          <Draggable key={entity.key} draggableId={entity.key} index={entityIndex}>
                            {(draggableProvided) => (
                              <div
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.draggableProps}
                                {...draggableProvided.dragHandleProps}>
                                <List className={classes.list} component="div" disablePadding>
                                  <ListItem button className={classes.nested}>
                                    <ListItemText primary={entity.name} />
                                    <ListItemText secondary="50cm" />
                                    <ListItemText secondary="Samsung" />
                                    <ListItemText secondary="blabla23" />
                                    <ListItemText secondary="20kg" />
                                    {entityLocation && (
                                      <IconButton
                                        style={{
                                          width: '30px',
                                        }}
                                        className={classes.iconButton}
                                        onClick={() => handleRemoveEntityLocation(entity)}>
                                        <LocationOnOutlinedIcon />
                                      </IconButton>
                                    )}
                                    {!entityLocation && (
                                      <div
                                        style={{
                                          width: '30px',
                                        }}></div>
                                    )}

                                    <ListItemSecondaryAction className={classes.addIconWrapper}>
                                      <IconButton
                                        className={classes.iconButton}
                                        onClick={() => addEntityToTBPTable(entity)}>
                                        <AddBoxIcon fontSize="large" color="primary" />
                                      </IconButton>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                </List>
                              </div>
                            )}
                          </Draggable>
                        );
                    })}
                  </EntitiesTypesListRow>
                ))}
              </div>
            )}
          </Droppable>
        </List>
      </Pane>
    </Container>
  );
}

export default EntitiesTypesList;