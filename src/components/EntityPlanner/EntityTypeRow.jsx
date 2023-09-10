import React from 'react'
import IconButton from '@mui/material/IconButton'
import { VisibilityOffOutlined, VisibilityOutlined, ArrowForwardIos, Clear } from '@mui/icons-material'
import { TableCell, TableRow } from '@mui/material'
import { DomEvent } from 'leaflet';
import { PenIcon } from '../../constants/icons';
import { EDIT_ENTITY_TYPE_DASH, ENTITIES_TYPES_DASH } from '../../constants/base';

export const EntityTypeRow = ({
    entity,
    isVisible, setIsVisible,
    numberPositioned, numberNotPositioned,
    setIsOpenArrow, isOpenArrow,
    match, history,
}) => {
    return (
        <TableRow>
            <TableCell style={{ fontWeight: isOpenArrow ? 'bolder' : 'normal' }}>
                {entity.name}
            </TableCell>
            <TableCell align="right">
                {numberPositioned} / {numberPositioned + numberNotPositioned}
            </TableCell>
            <TableCell padding='none' align="right">
                <IconButton style={{ padding: 0 }}
                    onClick={e => {
                        DomEvent.stop(e);
                        setIsVisible(!isVisible);
                    }}
                >
                    {isVisible ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                </IconButton>
            </TableCell>
            <TableCell padding='none' align="right">
                <IconButton style={{ padding: 0 }}
                    onClick={e => {
                        DomEvent.stop(e);
                        history.push(`/experiments/${match.params.id}/${ENTITIES_TYPES_DASH}/${entity.key}/${EDIT_ENTITY_TYPE_DASH}`)
                    }}
                >
                    <PenIcon />
                </IconButton>
            </TableCell>
            <TableCell padding='none' align="right">
                <IconButton style={{ padding: 0 }}
                    onClick={e => {
                        DomEvent.stop(e);
                        setIsOpenArrow(!isOpenArrow);
                    }}
                >
                    {isOpenArrow ? <Clear /> : <ArrowForwardIos />}
                </IconButton>
            </TableCell>
        </TableRow>
    )
}