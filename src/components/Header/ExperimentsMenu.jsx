import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import classnames from 'classnames';
import { TRIAL_SETS_DASH } from '../../constants/base';

export const ExperimentsMenu = ({ history, client, classes, experiments, currentExperiment }) => {
    const [menu, setMenu] = useState({ anchorEl: null, isHovering: false });

    const renderCurrentExperimentName = (currentExperiment) => {
        if (
            currentExperiment.name
            && currentExperiment.project.id
            && menu.isHovering
        ) {
            return `${currentExperiment.name} (ID: ${currentExperiment.project.id})`;
        }

        if (currentExperiment.name && !menu.isHovering) {
            return `${currentExperiment.name}`;
        }

        return 'Select an Experiment';
    }

    const selectExperiment = (experimentId) => {
        history.push(`/experiments/${experimentId}/${TRIAL_SETS_DASH}`);
        client.writeData({ data: { headerTabId: 0 } }); // 0 is the Trials tab
        setMenu({ ...menu, anchorEl: null });
    };

    return (
        <>
            <Button
                aria-controls="experiments-menu"
                aria-haspopup="true"
                onClick={(event) => setMenu({ anchorEl: event.currentTarget, isHovering: false })}
                disableRipple
                className={classnames(
                    classes.expandButton,
                    classes.expandExperimentButton,
                )}
                onMouseEnter={() => setMenu({ ...menu, isHovering: true })}
                onMouseLeave={() => setMenu({ ...menu, isHovering: false })}
            >
                {!isEmpty(currentExperiment) &&
                    renderCurrentExperimentName(currentExperiment)}
                <ExpandMoreIcon />
            </Button>
            {!isEmpty(experiments)
                && (
                    <Menu
                        id="experiments-menu"
                        open={Boolean(menu.anchorEl)}
                        onClose={() => setMenu({ ...menu, anchorEl: null })}
                        anchorEl={menu.anchorEl}
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
                        {!isEmpty(experiments)
                            && experiments.map(experiment => (
                                <MenuItem
                                    key={experiment.project.id}
                                    onClick={() => selectExperiment(experiment.project.id)}
                                >
                                    {experiment.name}
                                </MenuItem>
                            ))}
                    </Menu>
                )}
        </>
    )
}