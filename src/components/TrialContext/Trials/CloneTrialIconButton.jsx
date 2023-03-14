import React, { useState } from 'react';
import CustomTooltip from '../../CustomTooltip';
import classnames from 'classnames';
import uuid from 'uuid/v4';
import { CloneIcon } from '../../../constants/icons';
import { Grid, Menu, MenuItem } from '@material-ui/core';

export const CloneTrialIconButton = ({
    classes,
    cloneTrial,
    theme,
    trial,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    return (
        <>
            <CustomTooltip
                title="Clone from"
                ariaLabel="clone"
                onClick={e => setAnchorEl(e.currentTarget)}
            >
                <CloneIcon />
            </CustomTooltip>
            <Menu
                id="clone-menu"
                classes={{ paper: classes.menu }}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {['design', 'deploy'].map((destType) => (
                    <MenuItem
                        color={theme.palette[trial.status === 'deploy' ? 'orange' : 'violet'].main}
                        key={uuid()}
                        classes={{ root: classes.menuItem }}
                        onClick={async () => {
                            await cloneTrial(destType, trial);
                            setAnchorEl(null)
                        }}
                    >
                        <Grid
                            container
                            wrap="nowrap"
                            alignItems="center"
                        >
                            <div className={(classnames(classes.rect, classes[destType]))}></div>
                            {destType}
                        </Grid>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}