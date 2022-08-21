import React from 'react';
import { ReactComponent as CurveIcon } from './icons/CurveIcon.svg';
import { ReactComponent as DotIcon } from './icons/DotIcon.svg';
import { ReactComponent as DistrubteAlongLineIcon } from './icons/DistrubteAlongLineIcon.svg';
import { ReactComponent as MatrixIcon } from './icons/MatrixIcon.svg';
import { ReactComponent as FreePositioningIcon } from './icons/FreePositioningIcon.svg';
import { ReactComponent as RectangleIcon } from './icons/RectangleIcon.svg';
import { default as CloneTrialsIcon } from '@material-ui/icons/FilterNone';
import { default as EditEntityIcon } from '@material-ui/icons/Edit';
import {
  FREEPOSITIONING_TITLE,
  POINT_TITLE,
  CURVE_TITLE,
  DISTRUBTE_ALONG_LINE_TITLE,
  RECTANGLE_TITLE,
  MATRIX_TITLE,
  CLONE_TRIALS_TITLE,
  EDIT_ENTITY_TITLE,
} from '../../utils/constants';

import {
  FREEPOSITIONING_SHAPE,
  POINT_SHAPE,
  CURVE_SHAPE,
  DISTRUBTE_ALONG_LINE_SHAPE,
  RECTANGLE_SHAPE,
  MATRIX_SHAPE,
  CLONE_TRIALS_SHAPE,
  EDIT_ENTITY_SHAPE,
} from '../../utils/constants';

import {
  FreePositioning,
  Dot,
  Curve,
  DistrubteAlongLine,
  Rectangle,
  Matrix,
  CloneTrials,
  EditEntity,
} from '../ToolsBar';

export const icons = [
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
    value: MATRIX_SHAPE,
    component: <Matrix />,
    title: MATRIX_TITLE,
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
