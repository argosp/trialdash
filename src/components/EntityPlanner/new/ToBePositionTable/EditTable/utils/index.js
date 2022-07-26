import React from 'react'
import { ReactComponent as CurveIcon } from './icons/CurveIcon.svg'
import { ReactComponent as DotIcon } from './icons/DotIcon.svg'
import { ReactComponent as LineIcon } from './icons/LineIcon.svg'
import { ReactComponent as MatrixIcon } from './icons/MatrixIcon.svg'
import { ReactComponent as OnclickIcon } from './icons/OnclickIcon.svg'
import { ReactComponent as RectangleIcon } from './icons/RectangleIcon.svg'
import { default as CloneIcon } from '@material-ui/icons/FilterNone';
import EditIcon from '@material-ui/icons/Edit';

export const icons = [
    {
        icon: <OnclickIcon />,
        value: 'onclick'
    },
    {
        icon: <DotIcon />,
        value: 'dot'
    },
    {

        icon: <CurveIcon />,
        value: 'curve'

    },
    {
        icon: <LineIcon />,
        value: 'line'
    },
    {

        icon: <RectangleIcon />,
        value: 'rectangle'
    },
    {
        icon: <MatrixIcon />,
        value: 'matrix'
    },
    {
        icon: <CloneIcon htmlColor='black' />,
        value: 'clone'
    },
    {
        icon: <EditIcon htmlColor='black' />,
        value: 'edit'
    }
]