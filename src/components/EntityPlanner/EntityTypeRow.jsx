import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { VisibilityOffOutlined, VisibilityOutlined } from '@material-ui/icons'
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody } from '@material-ui/core'

export const EntityTypeRow = ({ entity, isVisible, setIsVisible, numberPositioned, numberNotPositioned }) => {
    return (
        <TableRow>
            <TableCell>
                {entity.name}
            </TableCell>
            <TableCell align="right">
                {numberPositioned} / {numberPositioned + numberNotPositioned}
            </TableCell>
            <TableCell align="right">
                <IconButton onClick={() => setIsVisible(!isVisible)}>
                    {
                        !!isVisible ?
                            <VisibilityOutlined />
                            :
                            <VisibilityOffOutlined />
                    }
                </IconButton>
            </TableCell>
        </TableRow>
    )
}