import React from "react";
import {
    Grid,
} from '@material-ui/core';
import { NumberTextField } from "./NumberTextField";

const roundDec = (num) => {
    return Math.round(num * 10) / 10;
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