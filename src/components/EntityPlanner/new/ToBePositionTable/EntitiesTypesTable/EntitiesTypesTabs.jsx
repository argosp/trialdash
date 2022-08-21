import React from 'react';
import { Typography, Box } from '@material-ui/core';
import StyledTabs from '../../../../StyledTabs';

const TabPanel = ({ children, value, index, ...other }) => (
  <Typography
    component="div"
    role="tabpanel"
    hidden={value !== index}
    id={`trial-tabpanel-${index}`}
    aria-labelledby={`trial-tab-${index}`}
    {...other}>
    <Box>{children}</Box>
  </Typography>
);

const EntitiesTypesTabs = ({ tabValue, setTabValue }) => {
  return (
    <>
      <StyledTabs
        tabs={[
          { key: 1 + '_D', label: 'Devices', id: 'deviceType-tab-0' },
          { key: 1 + '_G', label: 'Groups', id: 'deviceType-tab-1' },
        ]}
        value={tabValue}
        onChange={(e, val) => {
          setTabValue(val);
        }}
        ariaLabel="trial tabs"
      />
      <TabPanel value={tabValue} index={0}></TabPanel>
      <TabPanel value={tabValue} index={1}></TabPanel>
    </>
  );
};

export default EntitiesTypesTabs;
