import React from 'react';
import {
    Divider,
    IconButton,
    Typography,
    Grid,
    Box
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import {
    POINT_SHAPE
} from './utils/constants';


export const EditTool = ({ icon, id, component, title, chosenId, classes, markedPoints, onClickIcon }) => {
    const chosen = chosenId === id;
    const iconStyle = chosen ? classes.activeButton : null;
    const iconButtonStyle = chosen ? classes.notActiveButton : null;
    return (
        <div
            style={{ position: 'relative', textAlign: 'center' }}
            key={title}
            className={iconStyle}>
            <IconButton key={id} onClick={() => onClickIcon(id)} className={iconButtonStyle}>
                {icon}
            </IconButton>
            {chosen && id !== POINT_SHAPE && (
                <Box sx={{ position: 'absolute', top: 0, left: '100%', zIndex: 1000 }}>
                    <Grid container className={classes.toolBoxContainer}>
                        <Grid item className={classes.toolBoxItem}>
                            <IconButton onClick={() => onClickIcon(id)}>
                                <ChevronLeftIcon />
                            </IconButton>
                            <Typography component="span">
                                <Box sx={{ fontWeight: '700' }}>{title}</Box>
                            </Typography>
                        </Grid>
                        <Grid item>
                            {React.cloneElement(component, {
                                classes,
                                markedPoints,
                            })}
                        </Grid>
                    </Grid>
                </Box>
            )}
            {id === POINT_SHAPE && <Divider variant="middle" light />}
        </div>
    );
}