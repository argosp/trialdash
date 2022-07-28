import React, { useState } from 'react'
import { Grid, Typography, Box, Switch } from '@material-ui/core'
import { Button } from './Button'

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

const CloneTrials = ({ classes }) => {

    const [trialsState, setTrialsState] = useState({ trial1: false })

    const handleChange = (e) => {
        const name = e.target.name;
        const checked = e.target.checked;
        setTrialsState(p => ({ ...p, [name]: checked }))
    }

    return (
        <Box className={classes.cloneTrialsContainer} flexDirection={'column'}>
            {/* mapping on trials */}
            <Box
                className={classes.cloneTrialsContainer}
                flexDirection={'row'}
            >
                <Typography variant="overline" color="textPrimary">
                    <Box fontSize={10} fontWeight={500} >trials name</Box>
                </Typography>
                <Typography variant="overline" color="textPrimary">
                    <Box fontSize={10} fontWeight={500} > state </Box>
                </Typography>
            </Box>
            <Box 
            className={classnames(classes.cloneTrialsContainer, classes.cloneTrialsRow)}
            flexDirection={'row'}>
                <Typography variant="overline" component="span">
                    <Box fontSize={12} fontWeight={700} > trial one</Box>
                </Typography>
                <Box
                    component="span"
                    display="flex"
                    alignItems="center"
                    gridGap={4}
                >
                    <Typography component="span" >
                        <Box fontSize={12} >Design</Box>
                    </Typography>
                    <AntSwitch
                        checked={trialsState.trial1}
                        onChange={handleChange}
                        name="trial1"
                    />
                    <Typography children="Display" component="span">
                        <Box fontSize={12} >Display</Box>
                    </Typography>
                </Box>
            </Box>
            <Button text="clone trial" onClick={() => { }} />
        </Box>
    )
}

export default CloneTrials