import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Divider,
    Box,
} from '@material-ui/core';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import PlaceIcon from '@material-ui/icons/Place';

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
    DISTRIBUTE_ALONG_LINE_TITLE,
    RECTANGLE_TITLE,
    FREEPOSITIONING_SHAPE,
    POINT_SHAPE,
    CURVE_SHAPE,
    DISTRIBUTE_ALONG_LINE_SHAPE,
    RECTANGLE_SHAPE,
    CHOOSE_SHAPE,
    CHOOSE_TITLE,
    ARC_TITLE,
    ARC_SHAPE
} from './utils/constants.js';

import {
    FreePositioning,
    Dot,
    DistributeAlongLine,
    Rectangle,
    DistributeAlongArc
} from './ToolsBar';
import { EditTool } from './EditTool.jsx';

const useStyles = makeStyles(styles);

export const EditToolBox = ({
    handleSetOne,
    handleSetMany,
    markedPoints,
    showEditBox,
    setShowEditBox,
}) => {
    const classes = useStyles();
    const {
        shape,
        setShape,
        // rectRows,
        // setRectRows,
        // shapeOptions
    } = useShape();

    const onClickIcon = (id) => {
        setShowEditBox(id === shape ? !showEditBox : true);
        setShape(id);
    };

    return (
        <Box className={classnames(classes.root, classes.editToolBox)}>
            {/* <Typography variant="overline" align="center">
                tools
            </Typography> */}

            <EditTool classes={classes} shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={false}
                id={CHOOSE_SHAPE}
                icon={<PlaceIcon />}
                component={<PlaceIcon />}
                title={CHOOSE_TITLE}
            />
            <EditTool classes={classes} shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={showEditBox}
                id={FREEPOSITIONING_SHAPE}
                icon={<FreePositioningIcon />}
                component={
                    <FreePositioning
                        onSubmit={pos => handleSetOne({ latlng: { lat: pos.x, lng: pos.y } })}
                        buttonText={"free position"}
                    />
                }
                title={FREEPOSITIONING_TITLE}
            />
            <EditTool classes={classes} shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={showEditBox}
                id={POINT_SHAPE}
                icon={<DotIcon />}
                component={
                    <FreePositioning
                        onSubmit={pos => handleSetOne({ latlng: { lat: pos.x, lng: pos.y } })}
                        buttonText={"position all"}
                    />
                }
                title={POINT_TITLE}
            />
            <Divider variant="middle" light />
            <EditTool classes={classes} shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={showEditBox}
                id={CURVE_SHAPE}
                icon={<CurveIcon />}
                component={<DistributeAlongLine onSubmit={handleSetMany} />}
                title={CURVE_TITLE}
            />
            <EditTool classes={classes} shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={showEditBox}
                id={DISTRIBUTE_ALONG_LINE_SHAPE}
                icon={<DistrubteAlongLineIcon />}
                component={<DistributeAlongLine onSubmit={handleSetMany} />}
                title={DISTRIBUTE_ALONG_LINE_TITLE}
            />
            <EditTool classes={classes} shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={showEditBox}
                id={ARC_SHAPE}
                icon={<RotateLeftIcon fontSize="large" />}
                component={<DistributeAlongArc onSubmit={handleSetMany} />}
                title={ARC_TITLE}
            />
            <EditTool classes={classes} shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={showEditBox}
                id={RECTANGLE_SHAPE}
                icon={<RectangleIcon />}
                component={<Rectangle onSubmit={handleSetMany} />}
                title={RECTANGLE_TITLE}
            />
        </Box>
    );
}