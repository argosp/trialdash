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
    title: 'Text',
    iconComponent: <ImageAspectRatioOutlinedIcon />,
  },
  textArea: {
    title: 'Text area',
    iconComponent: <SubjectIcon />,
  },
  selectList: {
    title: 'Select list',
    iconComponent: <ViewColumnOutlinedIcon />,
  },
  boolean: {
    title: 'Boolean',
    iconComponent: <CheckBoxOutlinedIcon />,
  },
  number: {
    title: 'Number',
    iconComponent: <ViewQuiltOutlinedIcon />,
  },
  date: {
    title: 'Date',
    iconComponent: <CalendarTodayOutlinedIcon />,
  },
  time: {
    title: 'Time',
    iconComponent: <WatchLaterOutlinedIcon />,
  },
  location: {
    title: 'Location',
    iconComponent: <LocationOnOutlinedIcon />,
  },
};
