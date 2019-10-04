import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import classnames from 'classnames';
import { styles } from './styles';
import RightPanelContainer from '../RightPanelContainer';

// used to style field type when dragging (https://github.com/atlassian/react-beautiful-dnd/issues/216)
const FieldTypeItem = (
  ({ classes, rootClassName, icon, title }) => (
    <Grid container alignItems="center" className={rootClassName}>
      {icon}
      <span className={classes.fieldTypeTitle}>{title}</span>
    </Grid>
  )
);

class FieldTypesPanel extends React.Component {
  render() {
    const { classes, fieldTypes } = this.props;

    return (
      <RightPanelContainer
        title={<h3 className={classes.headerTitle}>Field Types</h3>}
      >
        <Droppable
          droppableId="droppable2"
          isDropDisabled
          isCombineEnabled={false}
        >
          {droppableProvided => (
            <div ref={droppableProvided.innerRef}>
              {fieldTypes.map((fieldType, index) => (
                <Draggable
                  key={fieldType.key}
                  draggableId={fieldType.key}
                  index={index}
                >
                  {(draggableProvided, snapshot) => (
                    <>
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                      >
                        <FieldTypeItem
                          classes={classes}
                          rootClassName={classes.fieldTypeWrapper}
                          icon={fieldType.iconComponent}
                          title={fieldType.title}
                        />
                      </div>
                      {snapshot.isDragging && (
                        <FieldTypeItem
                          classes={classes}
                          rootClassName={classnames(
                            classes.fieldTypeWrapper,
                            classes.fieldTypeWrapperCopy,
                          )}
                          icon={fieldType.iconComponent}
                          title={fieldType.title}
                        />
                      )}
                    </>
                  )}
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
