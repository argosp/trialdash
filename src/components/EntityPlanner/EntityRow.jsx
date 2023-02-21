import React from 'react';
import { TableRow, TableCell } from '@material-ui/core';

export const EntityRow = ({ entityItem, isSelected, onClick, children }) => {
    return (
        <TableRow
            key={entityItem.key}
        >
            <TableCell
                // style={{ fontWeight: isOpenArrow ? 'bolder' : 'normal' }}
                button
                // selected={isSelected}
                onClick={onClick}
            >
                {entityItem.name}
            </TableCell>
            <TableCell align="right" padding='none'>
                {children}
            </TableCell>
        </TableRow>
    )
}