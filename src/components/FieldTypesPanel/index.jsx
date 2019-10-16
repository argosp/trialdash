import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import classnames from 'classnames';
import { styles } from './styles';
import RightPanelContainer from '../RightPanelContainer';
import { FIELD_TYPES_ICONS } from '../../constants/fieldTypes';

// used to style field type when dragging (https://github.com/atlassian/react-beautiful-dnd/issues/216)
const FieldType = ({ classes, rootClassName, icon, title }) => (
  <Grid container alignItems="center" className={rootClassName}>
    {icon}
    <span className={classes.fieldTypeTitle}>{title}</span>
  </Grid>
);

class FieldTypesPanel extends React.Component {
  render() {
    const { classes, fieldTypes, isPanelOpen, onClose } = this.props;

    return (
      <RightPanelContainer
        isPanelOpen={isPanelOpen}
        onClose={onClose}
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
                        <FieldType
                          classes={classes}
                          rootClassName={
                            snapshot.isDragging
                              ? classnames(
                                classes.fieldTypeWrapper,
                                classes.fieldTypeWrapperDragging,
                              )
                              : classes.fieldTypeWrapper
                          }
                          icon={FIELD_TYPES_ICONS[fieldType.type]}
                          title={fieldType.label}
                        />
                      </div>
                      {snapshot.isDragging && (
                        <FieldType
                          classes={classes}
                          rootClassName={classnames(
                            classes.fieldTypeWrapper,
                            classes.fieldTypeWrapperCopy,
                          )}
                          icon={FIELD_TYPES_ICONS[fieldType.type]}
                          title={fieldType.label}
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
