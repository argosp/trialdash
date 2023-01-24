import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Divider,
    IconButton,
    Typography,
    Box
} from '@material-ui/core';

import classnames from 'classnames';
import { styles } from './styles';
import { PopperBox } from './PopperBox.jsx';
import { useShape } from '../ShapeContext.jsx';
import { ReactComponent as CurveIcon } from './utils/icons/CurveIcon.svg';
import { ReactComponent as DotIcon } from './utils/icons/DotIcon.svg';
import { ReactComponent as DistrubteAlongLineIcon } from './utils/icons/DistrubteAlongLineIcon.svg';
import { ReactComponent as FreePositioningIcon } from './utils/icons/FreePositioningIcon.svg';
import { ReactComponent as RectangleIcon } from './utils/icons/RectangleIcon.svg';
import {
    FREEPOSITIONING_TITLE,
    POINT_TITLE,
    CURVE_TITLE,
    DISTRUBTE_ALONG_LINE_TITLE,
    RECTANGLE_TITLE, FREEPOSITIONING_SHAPE,
    POINT_SHAPE,
    CURVE_SHAPE,
    DISTRUBTE_ALONG_LINE_SHAPE,
    RECTANGLE_SHAPE
} from './utils/constants';

import {
    FreePositioning,
    Dot,
    Curve,
    DistrubteAlongLine,
    Rectangle
} from './ToolsBar';

const useStyles = makeStyles(styles);

const EditTool = ({ icon, id, component, title, chosenId, classes, markedPoints, handleClick }) => {
    const chosen = chosenId === id;
    const iconStyle = chosen ? classes.activeButton : null;
    const iconButtonStyle = id !== '' && chosen ? classes.notActiveButton : null;
    return (
        <div
            style={{ position: 'relative', textAlign: 'center' }}
            key={title}
            className={iconStyle}>
            <IconButton key={id} onClick={() => handleClick(id)} className={iconButtonStyle}>
                {icon}
            </IconButton>
            {chosen && id !== POINT_SHAPE && (
                <PopperBox title={title} value={id} handleClick={handleClick} classes={classes}>
                    {React.cloneElement(component, {
                        classes,
                        // onSubmit,
                        // TBPEntities,
                        // removeEntityFromTBPTable,
                        markedPoints,
                    })}
                </PopperBox>
            )}
            {id === POINT_SHAPE && <Divider variant="middle" light />}
        </div>
    );
}

export const EditTable = ({
    TBPEntities,
    removeEntityFromTBPTable,
    onSingleShapeSubmit,
    handlePutEntitiesOnPrev,
    markedPoints,
}) => {
    const [editTableMode, setEditTableMode] = useState(FREEPOSITIONING_SHAPE);
    const classes = useStyles();
    const { shape, setShape, rectRows, setRectRows, shapeOptions } = useShape();

    const handleClick = (id) => {
        if (id !== '') {
            const state = id !== editTableMode ? id : POINT_SHAPE;
            setEditTableMode(state);
            setShape(state);
        }
    };

    const onSubmit = (positions) => {
        if (editTableMode === POINT_SHAPE || editTableMode === FREEPOSITIONING_SHAPE) {
            onSingleShapeSubmit({ latlng: { lat: positions.x, lng: positions.y } });
        } else {
            handlePutEntitiesOnPrev();
        }

        setEditTableMode(POINT_SHAPE);
    };

    return (
        <Box className={classnames(classes.root, classes.editTable)}>
            <Typography variant="overline" align="center">
                tools
            </Typography>

            <EditTool classes={classes} chosenId={shape} handleClick={handleClick} markedPoints={markedPoints}
                id={FREEPOSITIONING_SHAPE}
                icon={<FreePositioningIcon />}
                component={<FreePositioning />}
                title={FREEPOSITIONING_TITLE}
            />
            <EditTool classes={classes} chosenId={shape} handleClick={handleClick} markedPoints={markedPoints}
                id={POINT_SHAPE}
                icon={<DotIcon />}
                component={<Dot />}
                title={POINT_TITLE}
            />
            <Divider variant="middle" light />
            <EditTool classes={classes} chosenId={shape} handleClick={handleClick} markedPoints={markedPoints}
                id={CURVE_SHAPE}
                icon={<CurveIcon />}
                component={<Curve />}
                title={CURVE_TITLE}
            />
            <EditTool classes={classes} chosenId={shape} handleClick={handleClick} markedPoints={markedPoints}
                id={DISTRUBTE_ALONG_LINE_SHAPE}
                icon={<DistrubteAlongLineIcon />}
                component={<DistrubteAlongLine />}
                title={DISTRUBTE_ALONG_LINE_TITLE}
            />
            <EditTool classes={classes} chosenId={shape} handleClick={handleClick} markedPoints={markedPoints}
                id={RECTANGLE_SHAPE}
                icon={<RectangleIcon />}
                component={<Rectangle />}
                title={RECTANGLE_TITLE}
            />

            {
                // icons.map(({ icon, id, component, title }) => {
                // const iconStyle = editTableMode === id ? classes.activeButton : null;
                // const iconButtonStyle = editTableMode !== '' && editTableMode !== id ? classes.notActiveButton : null;
                // return (
                //     <div
                //         style={{ position: 'relative', textAlign: 'center' }}
                //         key={title}
                //         className={iconStyle}>
                //         <IconButton key={id} onClick={() => handleClick(id)} className={iconButtonStyle}>
                //             {icon}
                //         </IconButton>
                //         {editTableMode === id && id !== POINT_SHAPE && (
                //             <PopperBox title={title} value={id} handleClick={handleClick} classes={classes}>
                //                 {React.cloneElement(component, {
                //                     classes,
                //                     onSubmit,
                //                     TBPEntities,
                //                     removeEntityFromTBPTable,
                //                     markedPoints,
                //                 })}
                //             </PopperBox>
                //         )}
                //         {id === POINT_SHAPE && <Divider variant="middle" light />}
                //     </div>
                // );
                // })
            }
        </Box>
    );
}
