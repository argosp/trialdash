import React from 'react';
import { Box, Grid, IconButton, Typography } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

export const PopperBox = ({ title, id, handleClick, classes, children }) => {
    return (
      <Box sx={{ position: 'absolute', top: 0, left: '100%', zIndex: 1000 }}>
        <Grid container className={classes.toolBoxContainer}>
          <Grid item className={classes.toolBoxItem}>
            <IconButton onClick={() => handleClick(id)}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography component="span">
              <Box sx={{ fontWeight: '700' }}>{title}</Box>
            </Typography>
          </Grid>
          <Grid item>{children}</Grid>
        </Grid>
      </Box>
    );
  };

