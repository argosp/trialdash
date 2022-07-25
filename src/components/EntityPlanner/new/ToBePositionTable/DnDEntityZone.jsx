import React, { useEffect, useState } from 'react'
import TBPEntity from './TBPEntity'

import { SELECT_MODE, EDIT_MODE } from './utils/constants'

import { Draggable, Droppable } from 'react-beautiful-dnd'
import classnames from 'classnames';
import { isEmpty } from 'lodash';


import { makeStyles } from '@material-ui/core';
import { styles } from '../../../AddSetForm/styles'

import { ReactComponent as DnDIcon } from './DnDIcon.svg';

const useStyles = makeStyles(styles);

const DnDEntityZone = ({ addEntityMode, TBPEntities, isDragging, findEntityTypeName }) => {

    const classes = useStyles();
    const [dropZoneClassName, setDropZoneClassName] = useState(classnames(classes.dropZone))


    useEffect(() => {

        if (isEmpty(TBPEntities) && isDragging) {
            setDropZoneClassName(classnames(classes.dropZoneEmpty, classes.dropZoneEmptyDragging))
        }

        if (isEmpty(TBPEntities) && !isDragging) {
            setDropZoneClassName(classnames(classes.dropZoneEmpty))
        }
    }, [isDragging])

    return (
        <>
            {
                addEntityMode === SELECT_MODE &&
                <Droppable droppableId="edit-table-droppable">
                    {droppableProvided => (
                        <div
                            ref={droppableProvided.innerRef}
                            className={dropZoneClassName}
                            style={{
                                display: 'flex',
                                justifyContent: isEmpty(TBPEntities) ? 'center' : 'start',
                                alignItems: 'center',
                                margin: '8px auto',
                                width: '99%',
                                lineHeight: '10px',
                                flexDirection: 'column'
                            }}
                        >
                            {
                                isEmpty(TBPEntities) ?
                                    <>
                                        <DnDIcon />
                                        <p>
                                            Drag Devices Here
                                        </p>
                                    </>
                                    :

                                    TBPEntities.map((entity, index) => (
                                        <Draggable
                                            key={entity.key}
                                            draggableId={entity.key}
                                            index={index}
                                        // isDragDisabled={isDragDisabled}
                                        >
                                            {draggableProvided => (
                                                <div
                                                    ref={draggableProvided.innerRef}
                                                    {...draggableProvided.draggableProps}
                                                    {...draggableProvided.dragHandleProps}
                                                    style={{ width: '100%' }}
                                                >
                                                    <TBPEntity
                                                        entity={entity}
                                                        entityType={findEntityTypeName(entity.entitiesTypeKey)}
                                                        classes={classes.tbpEntity}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                    )

                            }
                            {droppableProvided.placeholder}
                        </div>)}
                </Droppable>
            }
        </>
    )
}

export default DnDEntityZone