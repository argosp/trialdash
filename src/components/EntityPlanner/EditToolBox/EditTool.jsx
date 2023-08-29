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
import CloseIcon from "@material-ui/icons/Close";
import {
    POINT_SHAPE
} from './utils/constants';
import { Button } from './ToolsBar/Button';

export const EditTool = ({ icon, id, component, title, shape, classes, markedPoints, onClickIcon, showEditBox, onSubmit, submitText }) => {
    const iconStyle = shape === id ? classes.activeButton : null;
    const iconButtonStyle = shape === id ? classes.notActiveButton : null;
    return (
        <div
            style={{ position: 'relative', textAlign: 'center' }}
            key={title}
            className={iconStyle}
            onClick={() => onClickIcon(id)}
        >
            <Tooltip
                title={title}
                placement="top"
            >
                <IconButton key={id}
                    className={iconButtonStyle}
                >
                    {icon}
                </IconButton>
            </Tooltip>
            {showEditBox && shape === id && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 'calc(100% + 10px)',
                        left: 0,
                        zIndex: 1000
                    }}
                >
                    <Grid container className={classes.toolBoxContainer}
                        style={{
                            minWidth: 300,
                            minHeight: `100%`
                        }}
                    >
                        <Grid item>
                            {React.cloneElement(component, {
                                classes,
                                markedPoints,
                                title
                            })}
                        </Grid>
                        <Grid item style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginTop: '10px'
                        }}>
                            <IconButton
                                // size='small'
                                onClick={() => onClickIcon(id)}
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography component="span">
                                <Box sx={{ fontWeight: '700' }}>
                                    {title}
                                </Box>
                            </Typography>
                            {!onSubmit ? null :
                                <Button className="button"
                                    text={submitText ? submitText : "distribute"}
                                    onClick={onSubmit}
                                    style={{ right: '0px', marginLeft: '5px' }}
                                />
                            }
                        </Grid>

                    </Grid>
                </Box>
            )}
            {id === POINT_SHAPE && <Divider variant="middle" light />}
        </div>
    );
}