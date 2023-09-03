import React from 'react';
import { withStyles } from '@mui/material/styles';

import { styles } from './styles';

const CustomHeadline = ({
  title,
  description,
  titleFontSize,
  descriptionFontSize,
  titleColor,
  descriptionColor,
  classes,
  className,
}) => (
  <div className={className}>
    <p
      style={{ fontSize: titleFontSize, color: titleColor }}
      className={classes.title}
    >
      {title}
    </p>
    <p
      style={{ fontSize: descriptionFontSize, color: descriptionColor }}
      className={classes.description}
    >
      {description}
    </p>
  </div>
);

export default withStyles(styles)(CustomHeadline);
