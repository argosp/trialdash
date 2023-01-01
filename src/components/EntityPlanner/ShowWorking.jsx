import React from 'react';
import { LinearProgress } from '@material-ui/core';

export const ShowWorking = ({ hasEntities, working }) => {
    return (
        (!hasEntities || working) ?
            (working === !!working ?
                <LinearProgress /> :
                <LinearProgress variant="determinate" value={working} />) : <></>
    )
}