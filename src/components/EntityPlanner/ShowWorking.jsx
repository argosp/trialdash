import React from 'react';
import { LinearProgress } from '@mui/material';
import { useEntities } from './EntitiesContext.jsx';

export const ShowWorking = () => {
    const {
        entities,
        working
    } = useEntities();
    return (
        (entities.length === 0 || working) ?
            (working === !!working ?
                <LinearProgress /> :
                <LinearProgress variant="determinate" value={working} />) : <></>
    )
}