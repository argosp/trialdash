import React from 'react';
import {
    Divider,
    IconButton,
    Typography,
    Grid,
    Box,
    Tooltip,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {
    POINT_SHAPE
} from './utils/constants';

export const EditTool = ({ icon, id, component, title, shape, classes, markedPoints, onClickIcon, showEditBox }) => {
    const iconStyle = shape === id ? classes.activeButton : null;
    const iconButtonStyle = shape === id ? classes.notActiveButton : null;
    return (
        <div
            style={{ position: 'relative', textAlign: 'center' }}
            key={title}
            className={iconStyle}
        >
            <Tooltip title={title} placement="right">
                <IconButton key={id}
                    onClick={() => onClickIcon(id)}
                    className={iconButtonStyle}
                >
                    {icon}
                </IconButton>
            </Tooltip>
            {showEditBox && shape === id && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: '100%',
                        zIndex: 1000
                    }}
                >
                    <Grid container className={classes.toolBoxContainer}
                        style={{
                            minWidth: 300,
                            minHeight: `calc(100% + 20px)`
                        }}
                    >
                        <Grid item style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>
                            <IconButton onClick={() => onClickIcon(id)}>
                                <ChevronLeftIcon />
                            </IconButton>
                            <Typography component="span">
                                <Box sx={{ fontWeight: '700' }}>
                                    {title}
                                </Box>
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