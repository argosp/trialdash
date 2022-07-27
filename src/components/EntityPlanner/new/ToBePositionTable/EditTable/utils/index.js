import React from 'react'
import { ReactComponent as CurveIcon } from './icons/CurveIcon.svg'
import { ReactComponent as DotIcon } from './icons/DotIcon.svg'
import { ReactComponent as DistrubteAlongLineIcon } from './icons/DistrubteAlongLineIcon.svg'
import { ReactComponent as MatrixIcon } from './icons/MatrixIcon.svg'
import { ReactComponent as FreePositioningIcon } from './icons/FreePositioningIcon.svg'
import { ReactComponent as RectangleIcon } from './icons/RectangleIcon.svg'
import { default as CloneTrialsIcon } from '@material-ui/icons/FilterNone';
import { default as EditEntityIcon } from '@material-ui/icons/Edit';
import {
    FREEPOSITIONING_MODE,
    DOT_MODE,
    CURVE_MODE,
    DISTRUBTE_ALONG_LINE_MODE,
    RECTANGLE_MODE,
    MATRIX_MODE,
    CLONE_TRIALS_MODE,
    EDIT_ENTITY_MODE,
} from '../../utils/constants'

import {
    FreePositioning,
    Dot,
    Curve,
    DistrubteAlongLine,
    Rectangle,
    Matrix,
    CloneTrials,
    EditEntity

} from '../ToolsBar'

export const icons = [
    {
        icon: <FreePositioningIcon />,
        value: FREEPOSITIONING_MODE,
        component: <FreePositioning />
    },
    {
        icon: <DotIcon />,
        value: DOT_MODE,
        component: <Dot />
    },
    {

        icon: <CurveIcon />,
        value: CURVE_MODE,
        component: <Curve />

    },
    {
        icon: <DistrubteAlongLineIcon />,
        value: DISTRUBTE_ALONG_LINE_MODE,
        component: <DistrubteAlongLine />
    },
    {

        icon: <RectangleIcon />,
        value: RECTANGLE_MODE,
        component: <Rectangle />
    },
    {
        icon: <MatrixIcon />,
        value: MATRIX_MODE,
        component: <Matrix />
    },
    {
        icon: <CloneTrialsIcon htmlColor='black' />,
        value: CLONE_TRIALS_MODE,
        component: <CloneTrials />
    },
    {
        icon: <EditEntityIcon htmlColor='black' />,
        value: EDIT_ENTITY_MODE,
        component: <EditEntity />
    }
]