import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Divider,
    IconButton,
    Typography,
    Box
} from '@material-ui/core';
import {
    FilterNone as CloneTrialsIcon,
    Edit as EditEntityIcon
} from '@material-ui/icons';

import classnames from 'classnames';
import { styles } from './styles';
import { PopperBox } from './PopperBox.jsx';
import { useShape } from '../ShapeContext.jsx';
import { ReactComponent as CurveIcon } from './utils/icons/CurveIcon.svg';
import { ReactComponent as DotIcon } from './utils/icons/DotIcon.svg';
import { ReactComponent as DistrubteAlongLineIcon } from './utils/icons/DistrubteAlongLineIcon.svg';
import { ReactComponent as MatrixIcon } from './utils/icons/MatrixIcon.svg';
import { ReactComponent as FreePositioningIcon } from './utils/icons/FreePositioningIcon.svg';
import { ReactComponent as RectangleIcon } from './utils/icons/RectangleIcon.svg';
import {
    FREEPOSITIONING_TITLE,
    POINT_TITLE,
    CURVE_TITLE,
    DISTRUBTE_ALONG_LINE_TITLE,
    RECTANGLE_TITLE,
    SQUARE_TITLE,
    CLONE_TRIALS_TITLE,
    EDIT_ENTITY_TITLE,
    FREEPOSITIONING_SHAPE,
    POINT_SHAPE,
    CURVE_SHAPE,
    DISTRUBTE_ALONG_LINE_SHAPE,
    RECTANGLE_SHAPE,
    SQUARE_SHAPE,
    CLONE_TRIALS_SHAPE,
    EDIT_ENTITY_SHAPE,
} from './utils/constants';

import {
    FreePositioning,
    Dot,
    Curve,
    DistrubteAlongLine,
    Rectangle,
    Square,
    CloneTrials,
    EditEntity,
} from './ToolsBar';

const useStyles = makeStyles(styles);

const icons = [
    {
        icon: <FreePositioningIcon />,
        value: FREEPOSITIONING_SHAPE,
        component: <FreePositioning />,
        title: FREEPOSITIONING_TITLE,
    },
    {
        icon: <DotIcon />,
        value: POINT_SHAPE,
        component: <Dot />,
        title: POINT_TITLE,
    },
    {
        icon: <CurveIcon />,
        value: CURVE_SHAPE,
        component: <Curve />,
        title: CURVE_TITLE,
    },
    {
        icon: <DistrubteAlongLineIcon />,
        value: DISTRUBTE_ALONG_LINE_SHAPE,
        component: <DistrubteAlongLine />,
        title: DISTRUBTE_ALONG_LINE_TITLE,
    },
    {
        icon: <RectangleIcon />,
        value: RECTANGLE_SHAPE,
        component: <Rectangle />,
        title: RECTANGLE_TITLE,
    },
    {
        icon: <MatrixIcon />,
        value: SQUARE_SHAPE,
        component: <Square />,
        title: SQUARE_TITLE,
    },
    {
        icon: <CloneTrialsIcon htmlColor="black" />,
        value: CLONE_TRIALS_SHAPE,
        component: <CloneTrials />,
        title: CLONE_TRIALS_TITLE,
    },
    {
        icon: <EditEntityIcon htmlColor="black" />,
        value: EDIT_ENTITY_SHAPE,
        component: <EditEntity />,
        title: EDIT_ENTITY_TITLE,
    },
];

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

    const handleClick = (value) => {
        if (value !== '') {
            const state = value !== editTableMode ? value : POINT_SHAPE;
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

            {icons.map(({ icon, value, component, title }) => {
                const iconStyle = editTableMode === value ? classes.activeButton : null;
                const iconButtonStyle = editTableMode !== '' && editTableMode !== value ? classes.notActiveButton : null;
                return (
                    <div
                        style={{ position: 'relative', textAlign: 'center' }}
                        key={title}
                        className={iconStyle}>
                        <IconButton key={value} onClick={() => handleClick(value)} className={iconButtonStyle}>
                            {icon}
                        </IconButton>
                        {editTableMode === value && value !== POINT_SHAPE && (
                            <PopperBox title={title} value={value} handleClick={handleClick} classes={classes}>
                                {React.cloneElement(component, {
                                    classes,
                                    onSubmit,
                                    TBPEntities,
                                    removeEntityFromTBPTable,
                                    markedPoints,
                                })}
                            </PopperBox>
                        )}
                        {value === POINT_SHAPE && <Divider variant="middle" light />}
                    </div>
                );
            })}
        </Box>
    );
}
