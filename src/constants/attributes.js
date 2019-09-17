import React from 'react';
import ImageAspectRatioOutlinedIcon from '@material-ui/icons/ImageAspectRatioOutlined';
import SubjectIcon from '@material-ui/icons/Subject';
import ViewColumnOutlinedIcon from '@material-ui/icons/ViewColumnOutlined';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import ViewQuiltOutlinedIcon from '@material-ui/icons/ViewQuiltOutlined';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

export const FIELD_TYPES = {
  text: {
    key: 0,
    title: 'Text',
    iconComponent: <ImageAspectRatioOutlinedIcon />,
  },
  textArea: {
    key: 1,
    title: 'Text Area',
    iconComponent: <SubjectIcon />,
  },
  selectList: {
    key: 2,
    title: 'Select List',
    iconComponent: <ViewColumnOutlinedIcon />,
  },
  boolean: {
    key: 3,
    title: 'Boolean',
    iconComponent: <CheckBoxOutlinedIcon />,
  },
  number: {
    key: 4,
    title: 'Number',
    iconComponent: <ViewQuiltOutlinedIcon />,
  },
  date: {
    key: 5,
    title: 'Date',
    iconComponent: <CalendarTodayOutlinedIcon />,
  },
  time: {
    key: 6,
    title: 'Time',
    iconComponent: <WatchLaterOutlinedIcon />,
  },
  location: {
    key: 7,
    title: 'Location',
    iconComponent: <LocationOnOutlinedIcon />,
  },
};
