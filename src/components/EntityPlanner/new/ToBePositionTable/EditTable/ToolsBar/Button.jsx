import { Button as MuiButton } from '@material-ui/core'
import React from 'react'

export const Button = ({ text, ...rest }) => {
    return (
        <MuiButton
            variant="outlined"
            color="primary"
            style={{ width: '95%', margin: '10px auto' }}
            {...rest}
        >
            {text}</MuiButton >
    )
}
