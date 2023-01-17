import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { VisibilityOffOutlined, VisibilityOutlined, ArrowForwardIos, Clear } from '@material-ui/icons'
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody } from '@material-ui/core'

export const EntityTypeRow = ({ entity, isVisible, setIsVisible, numberPositioned, numberNotPositioned, setIsOpenArrow, isOpenArrow }) => {
    return (
        <TableRow>
            <TableCell style={{ fontWeight: isOpenArrow ? 'bolder' : 'normal' }}>
                {entity.name}
            </TableCell>
            <TableCell align="right">
                {numberPositioned} / {numberPositioned + numberNotPositioned}
            </TableCell>
            <TableCell padding='none' align="right">
                <IconButton style={{ padding: 0 }} onClick={() => setIsVisible(!isVisible)}>
                    {isVisible ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                </IconButton>
            </TableCell>
            <TableCell padding='none' align="right">
                <IconButton style={{ padding: 0 }} onClick={() => setIsOpenArrow(!isOpenArrow)}>
                    {isOpenArrow ? <Clear /> : <ArrowForwardIos />}
                </IconButton>
            </TableCell>
        </TableRow>
    )
}