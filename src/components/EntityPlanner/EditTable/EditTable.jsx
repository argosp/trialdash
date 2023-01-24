import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Divider,
    IconButton,
    Typography,
    Grid,
    Box
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import classnames from 'classnames';
import { styles } from './styles';
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

const EditTool = ({ icon, id, component, title, chosenId, classes, markedPoints, onClickIcon }) => {
    const chosen = chosenId === id;
    const iconStyle = chosen ? classes.activeButton : null;
    const iconButtonStyle = chosen ? classes.notActiveButton : null;
    return (
        <div
            style={{ position: 'relative', textAlign: 'center' }}
            key={title}
            className={iconStyle}>
            <IconButton key={id} onClick={() => onClickIcon(id)} className={iconButtonStyle}>
                {icon}
            </IconButton>
            {chosen && id !== POINT_SHAPE && (
                <Box sx={{ position: 'absolute', top: 0, left: '100%', zIndex: 1000 }}>
                    <Grid container className={classes.toolBoxContainer}>
                        <Grid item className={classes.toolBoxItem}>
                            <IconButton onClick={() => onClickIcon(id)}>
                                <ChevronLeftIcon />
                            </IconButton>
                            <Typography component="span">
                                <Box sx={{ fontWeight: '700' }}>{title}</Box>
                            </Typography>
                        </Grid>
                        <Grid item>
                            {React.cloneElement(component, {
                                classes,
                                // onSubmit,
                                // TBPEntities,
                                // removeEntityFromTBPTable,
                                markedPoints,
                            })}
                        </Grid>
                    </Grid>
                </Box>
            )}
            {id === POINT_SHAPE && <Divider variant="middle" light />}
        </div>
    );
}

export const EditTable = ({
    handleSetOne,
    handleSetMany,
    markedPoints,
}) => {
    const [editTableMode, setEditTableMode] = useState(FREEPOSITIONING_SHAPE);
    const classes = useStyles();
    const { shape, setShape, rectRows, setRectRows, shapeOptions } = useShape();

    const onClickIcon = (id) => {
        if (id !== '') {
            const state = id !== editTableMode ? id : POINT_SHAPE;
            setEditTableMode(state);
            setShape(state);
        }
    };

    // const onSubmit = (positions) => {
    //     if (editTableMode === POINT_SHAPE || editTableMode === FREEPOSITIONING_SHAPE) {
    //         handleSetOne({ latlng: { lat: positions.x, lng: positions.y } });
    //     } else {
    //         handleSetMany();
    //     }

    //     setEditTableMode(POINT_SHAPE);
    // };

    return (
        <Box className={classnames(classes.root, classes.editTable)}>
            <Typography variant="overline" align="center">
                tools
            </Typography>

            <EditTool classes={classes} chosenId={shape} onClickIcon={onClickIcon} markedPoints={markedPoints}
                id={FREEPOSITIONING_SHAPE}
                icon={<FreePositioningIcon />}
                component={<FreePositioning onSubmit={pos => handleSetOne({ latlng: { lat: pos.x, lng: pos.y } })}/>}
                title={FREEPOSITIONING_TITLE}
            />
            <EditTool classes={classes} chosenId={shape} onClickIcon={onClickIcon} markedPoints={markedPoints}
                id={POINT_SHAPE}
                icon={<DotIcon />}
                component={<Dot />}
                title={POINT_TITLE}
            />
            <Divider variant="middle" light />
            <EditTool classes={classes} chosenId={shape} onClickIcon={onClickIcon} markedPoints={markedPoints}
                id={CURVE_SHAPE}
                icon={<CurveIcon />}
                component={<Curve onSubmit={handleSetMany}/>}
                title={CURVE_TITLE}
            />
            <EditTool classes={classes} chosenId={shape} onClickIcon={onClickIcon} markedPoints={markedPoints}
                id={DISTRUBTE_ALONG_LINE_SHAPE}
                icon={<DistrubteAlongLineIcon />}
                component={<DistrubteAlongLine onSubmit={handleSetMany}/>}
                title={DISTRUBTE_ALONG_LINE_TITLE}
            />
            <EditTool classes={classes} chosenId={shape} onClickIcon={onClickIcon} markedPoints={markedPoints}
                id={RECTANGLE_SHAPE}
                icon={<RectangleIcon />}
                component={<Rectangle onSubmit={handleSetMany}/>}
                title={RECTANGLE_TITLE}
            />
        </Box>
    );
}
