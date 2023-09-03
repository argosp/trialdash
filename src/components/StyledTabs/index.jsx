import { withStyles } from '@mui/styles';
import Tabs from '@mui/material/Tabs';
import React from 'react';
import Tab from '@mui/material/Tab';
import { tabsStyles, styles } from './styles';

const StyledTabs = withStyles(tabsStyles)(props => (
  <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />
));

export default withStyles(styles)(
  props => (
    <StyledTabs
      value={props.value}
      onChange={props.onChange}
      aria-label={props.ariaLabel}
      className={props.className}
    >
      {props.tabs.map(tab => (
        <Tab
          key={tab.key}
          disableRipple
          label={tab.label}
          id={tab.id}
          className={props.classes.tab}
        />
      ))}
    </StyledTabs>
  ),
);
