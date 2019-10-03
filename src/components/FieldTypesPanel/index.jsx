import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { styles } from './styles';
import RightPanelContainer from '../RightPanelContainer';

class FieldTypesPanel extends React.Component {
  render() {
    const { classes, fieldTypes } = this.props;

    return (
      <RightPanelContainer title={<h3 className={classes.headerTitle}>Field Types</h3>}>
        <Droppable droppableId="droppable2" isDropDisabled isCombineEnabled={false}>
          {droppableProvided => (
            <div
              ref={droppableProvided.innerRef}
            >
              {fieldTypes.map((fieldType, index) => (
                <Draggable
                  key={fieldType.key}
                  draggableId={fieldType.key}
                  index={index}
                >
                  {draggableProvided => (
                    <Grid
                      container
                      alignItems="center"
                      className={classes.fieldTypeWrapper}
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      {fieldType.iconComponent}
                      <span className={classes.fieldTypeTitle}>{fieldType.title}</span>
                    </Grid>
                  )
                }
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </RightPanelContainer>
    );
  }
}

export default withStyles(styles)(FieldTypesPanel);
