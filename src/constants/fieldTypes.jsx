import React from 'react';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import uuid from 'uuid/v4';
import { DateIcon, NumberIcon, SelectListIcon, TextAreaIcon, TextIcon } from './icons';

const FIELD_TYPE_BASE = {
  description: 'a short description of the field',
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
    name: 'Text',
    type: 'text',
  },
  textArea: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Text Area',
    name: 'Text Area',
    type: 'textArea',
  },
  selectList: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Select List',
    name: 'Select List',
    type: 'selectList',
    fields: ['value', 'multipleValues'],
  },
  boolean: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Boolean',
    name: 'Boolean',
    type: 'boolean',
  },
  number: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Number',
    name: 'Number',
    type: 'number',
  },
  datetime: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Date Time',
    name: 'Date Time',
    type: 'datetime-local',
  },
  date: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Date',
    name: 'Date',
    type: 'date',
  },
  time: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Time',
    name: 'Time',
    type: 'time',
  },
  location: {
    ...FIELD_TYPE_BASE,
    key: uuid(),
    label: 'Location',
    name: 'Location',
    type: 'location',
  },
};

export const FIELD_TYPES_ICONS = {
  text: <TextIcon />,
  textArea: <TextAreaIcon />,
  selectList: <SelectListIcon />,
  boolean: <CheckBoxOutlinedIcon />,
  number: <NumberIcon />,
  date: <DateIcon />,
  time: <WatchLaterOutlinedIcon />,
  location: <LocationOnOutlinedIcon />,
  'datetime-local': <DateIcon />,
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
