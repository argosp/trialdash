import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { VisibilityOffOutlined, VisibilityOutlined, ArrowForwardIos } from '@material-ui/icons'
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody } from '@material-ui/core'

const VisibilityButton = ({ isVisible, setIsVisible }) => (
    <IconButton onClick={() => setIsVisible(!isVisible)} style={{ padding: 0 }}>
        {!!isVisible ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
    </IconButton>
)

export const EntityTypeRow = ({ entity, isVisible, setIsVisible, numberPositioned, numberNotPositioned, onClickArrow }) => {
    return (
        <TableRow>
            <TableCell>
                {entity.name}
            </TableCell>
            <TableCell align="right">
                {numberPositioned} / {numberPositioned + numberNotPositioned}
            </TableCell>
            <TableCell padding='none' align="right">
                <VisibilityButton setIsVisible={setIsVisible} isVisible={isVisible} />
            </TableCell>
            <TableCell padding='none' align="right">
                <IconButton style={{ padding: 0 }} onClick={() => onClickArrow()}>
                    <ArrowForwardIos />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}