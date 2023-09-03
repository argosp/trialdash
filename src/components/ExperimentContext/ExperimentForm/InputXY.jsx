import React from "react";
import {
    Grid,
} from '@mui/material';
import { NumberTextField } from "./NumberTextField";

const roundDec = (num) => {
    return Math.round(num * 1000) / 1000;
}

export const InputXY = ({ x, y, setX, setY, name, units}) => {
    return (
        <Grid container spacing={2}>
            <Grid item>
                <NumberTextField value={roundDec(x)} onChange={(num) => setX(num)} label={name + " X " + units} width='150px' />
            </Grid>
            <Grid item>
                <NumberTextField value={roundDec(y)} onChange={(num) => setY(num)} label={name + " Y " + units} width='150px' />
            </Grid>
        </Grid>
    )
}