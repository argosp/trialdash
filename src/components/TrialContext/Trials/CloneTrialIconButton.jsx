import React, { useState } from 'react';
import CustomTooltip from '../../CustomTooltip';
import uuid from 'uuid/v4';
import { CloneIcon } from '../../../constants/icons';
import { Menu, MenuItem } from '@material-ui/core';
import { COLORS_STATUSES } from '../../../constants/base';

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
                {Object.keys(COLORS_STATUSES).map((destType) => {
                    return (
                        <MenuItem
                            key={uuid()}
                            classes={{ root: classes.menuItem }}
                            onClick={async () => {
                                await cloneTrial(destType, trial);
                                setAnchorEl(null);
                            }}
                            style={{
                                color: theme.palette[COLORS_STATUSES[destType].color].main
                            }}
                        >
                            {destType}
                        </MenuItem>
                    )
                })}
            </Menu>
        </>
    )
}