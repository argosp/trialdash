import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { VisibilityOffOutlined, VisibilityOutlined, ArrowForwardIos } from '@material-ui/icons'
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody } from '@material-ui/core'

const VisibilityButton = ({ isVisible, setIsVisible }) => (
    <IconButton onClick={() => setIsVisible(!isVisible)}>
        {!!isVisible ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
    </IconButton>
)

export const EntityTypeRow = ({ entity, isVisible, setIsVisible, numberPositioned, numberNotPositioned }) => {
    return (
        <TableRow>
            <TableCell padding='none'>
                {entity.name}
            </TableCell>
            <TableCell padding='none' align="right">
                {numberPositioned} / {numberPositioned + numberNotPositioned}
            </TableCell>
            <TableCell padding='none' align="right">
                <VisibilityButton setIsVisible={setIsVisible} isVisible={isVisible} />
            </TableCell>
            <TableCell padding='none' align="right">
                <IconButton>
                    <ArrowForwardIos />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}