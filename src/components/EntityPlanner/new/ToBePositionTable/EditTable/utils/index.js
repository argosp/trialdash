import React from 'react'
import { ReactComponent as CurveIcon } from './icons/CurveIcon.svg'
import { ReactComponent as DotIcon } from './icons/DotIcon.svg'
import { ReactComponent as LineIcon } from './icons/LineIcon.svg'
import { ReactComponent as MatrixIcon } from './icons/MatrixIcon.svg'
import { ReactComponent as OnclickIcon } from './icons/OnclickIcon.svg'
import { ReactComponent as RectangleIcon } from './icons/RectangleIcon.svg'
import { default as CloneIcon } from '@material-ui/icons/FilterNone';
import EditIcon from '@material-ui/icons/Edit';
import {
    ONCLICK_MODE,
    DOT_MODE,
    CURVE_MODE,
    LINE_MODE,
    RECTANGLE_MODE,
    MATRIX_MODE,
    CLONE_MODE,
    EDIT_ENTITY_MODE,
} from '../../utils/constants'

import {
    Onclick,
    Dot,
    Curve,
    Line,
    Rectangle,
    Matrix
} from '../sub_cmps'

export const icons = [
    {
        icon: <OnclickIcon />,
        value: ONCLICK_MODE,
        component: <Onclick />
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
        icon: <LineIcon />,
        value: LINE_MODE,
        component: <Line />
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
        icon: <CloneIcon htmlColor='black' />,
        value: CLONE_MODE,
        component: <h2></h2>
    },
    {
        icon: <EditIcon htmlColor='black' />,
        value: EDIT_ENTITY_MODE,
        component: <h2></h2>
    }
]