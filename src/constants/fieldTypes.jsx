import React from 'react';
import ImageAspectRatioOutlinedIcon from '@material-ui/icons/ImageAspectRatioOutlined';
import SubjectIcon from '@material-ui/icons/Subject';
import ViewColumnOutlinedIcon from '@material-ui/icons/ViewColumnOutlined';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import ViewQuiltOutlinedIcon from '@material-ui/icons/ViewQuiltOutlined';
import EventIcon from '@material-ui/icons/Event';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import uuid from 'uuid/v4';

const FIELD_TYPE_BASE = {
  description: 'a short description of the field',
  id: '',
  prefix: '',
  suffix: '',
  required: false,
  template: '',
  multipleValues: false,
  trialField: false,
};

export const FIELD_TYPES = {
  text: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Text',
    type: 'text',
  },
  textArea: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Text Area',
    type: 'textArea',
  },
  selectList: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Select List',
    type: 'selectList',
  },
  boolean: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Boolean',
    type: 'boolean',
  },
  number: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Number',
    type: 'number',
  },
  date: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Date',
    type: 'date',
  },
  time: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Time',
    type: 'time',
  },
  location: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Location',
    type: 'location',
  },
};

export const FIELD_TYPES_ICONS = {
  text: <ImageAspectRatioOutlinedIcon />,
  textArea: <SubjectIcon />,
  selectList: <ViewColumnOutlinedIcon />,
  boolean: <CheckBoxOutlinedIcon />,
  number: <ViewQuiltOutlinedIcon />,
  date: <EventIcon />,
  time: <WatchLaterOutlinedIcon />,
  location: <LocationOnOutlinedIcon />,
};

const generateFieldTypesArray = () => {
  const fieldTypesArray = [];

  Object.keys(FIELD_TYPES).forEach((fieldType) => {
    fieldTypesArray.push(FIELD_TYPES[fieldType]);
  });

  return fieldTypesArray;
};

export const FIELD_TYPES_ARRAY = generateFieldTypesArray();

export const FIELD_TYPE_ITEM_INPUT_TYPE = 'input';
export const FIELD_TYPE_ITEM_CHECKBOX_TYPE = 'checkbox';
export const FIELD_TYPE_ITEM_RADIO_TYPE = 'radio';
