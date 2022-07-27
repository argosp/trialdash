import React, { useState } from 'react'
import { Grid, Typography, Box, Switch } from '@material-ui/core'
import { withStyles } from '@material-ui/styles';

import classnames from 'classnames';


const AntSwitch = withStyles((theme) => ({
    root: {
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: theme.palette.grey[500],
        '&$checked': {
            transform: 'translateX(12px)',
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
            },
        },
    },
    thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none',
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
    },
    checked: {},
}))(Switch);

const TrialRow = ({ classes, children }) => (<div className={classes}>{children}</div>)

const Column = ({ classes, children }) => (<div className={classes}>{children}</div>)

const CloneTrials = ({classes}) => {

    const [trialsState, setTrialsState] = useState({ trial1: false })

    const handleChange = (e) => {
        const name = e.target.name;
        const checked = e.target.checked;
        setTrialsState(p => ({ ...p, [name]: checked }))
    }

    return (
        <>
            <Box classes={classes.cloneTrialsContainer}>
                <Column classes={classes.cloneTrialsCol}>
                    <Typography variant="overline" color="textSecondary">
                        trials name
                    </Typography>
                </Column>
                <Column classes={classes.cloneTrialsCol}>
                    <Typography variant="overline" color="textSecondary">
                        state
                    </Typography>
                </Column>
            </Box>
            <Box className={classes.cloneTrialsContainer}>
                <TrialRow classes={classnames(classes.cloneTrialsContainer, classes.cloneTrialsRow)}>
                    <Typography className={classes.cloneTrialsCol} variant="overline" component="div">
                        trial one
                    </Typography>
                    <Typography className={classes.cloneTrialsCol} component="div">
                        <Grid component="label" container alignItems="center" spacing={1}>
                            <Grid item>Design</Grid>
                            <Grid item>
                                <AntSwitch
                                    checked={trialsState.trial1}
                                    onChange={handleChange}
                                    name="trial1"
                                />
                            </Grid>
                            <Grid item>Deploy</Grid>
                        </Grid>
                    </Typography>
                </TrialRow>
            </Box>
        </>
    )
}

export default CloneTrials