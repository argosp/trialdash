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

export const FIELD_TYPES = {
  text: {
    key: uuid(),
    title: 'Text',
    iconComponent: <ImageAspectRatioOutlinedIcon />,
    type: 'text',
  },
  textArea: {
    key: uuid(),
    title: 'Text Area',
    iconComponent: <SubjectIcon />,
    type: 'textArea',
  },
  selectList: {
    key: uuid(),
    title: 'Select List',
    iconComponent: <ViewColumnOutlinedIcon />,
    type: 'selectList',
  },
  boolean: {
    key: uuid(),
    title: 'Boolean',
    iconComponent: <CheckBoxOutlinedIcon />,
    type: 'boolean',
  },
  number: {
    key: uuid(),
    title: 'Number',
    iconComponent: <ViewQuiltOutlinedIcon />,
    type: 'number',
  },
  date: {
    key: uuid(),
    title: 'Date',
    iconComponent: <EventIcon />,
    type: 'date',
  },
  time: {
    key: uuid(),
    title: 'Time',
    iconComponent: <WatchLaterOutlinedIcon />,
    type: 'time',
  },
  location: {
    key: uuid(),
    title: 'Location',
    iconComponent: <LocationOnOutlinedIcon />,
    type: 'location',
  },
};

const generateFieldTypesArray = () => {
  const fieldTypesArray = [];

  Object.keys(FIELD_TYPES).forEach((fieldType) => {
    fieldTypesArray.push(FIELD_TYPES[fieldType]);
  });

  return fieldTypesArray;
};

export const FIELD_TYPES_ARRAY = generateFieldTypesArray();

export const ATTRIBUTE_ITEM_INPUT_TYPE = 'input';
export const ATTRIBUTE_ITEM_CHECKBOX_TYPE = 'checkbox';
export const ATTRIBUTE_ITEM_RADIO_TYPE = 'radio';
