import React, { useEffect } from 'react';
import { EntityTypeRow } from './EntityTypeRow.jsx';
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper } from '@material-ui/core'

export const TypeChooser = ({ shownEntityTypes, setShownEntityTypes, entities, entityItems, onClickType }) => {

    useEffect(() => {
        if (shownEntityTypes.length === 0 && entities.length > 0) {
            setShownEntityTypes(entities.map(e => e.name));
        }
    }, [shownEntityTypes, entities])

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Positioned</TableCell>
                        <TableCell align="right" padding='none'></TableCell>
                        <TableCell align="right" padding='none'></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entities.map(entity => {
                        const items = entityItems.filter(({ entityType }) => entityType.name === entity.name);
                        const positioned = items.filter(({ location }) => location);
                        const notPositioned = items.filter(({ location }) => !location);
                        return (
                            <EntityTypeRow
                                entity={entity}
                                isVisible={shownEntityTypes.includes(entity.name)}
                                setIsVisible={(toshow) => {
                                    if (toshow) {
                                        setShownEntityTypes([...shownEntityTypes, entity.name]);
                                    } else {
                                        setShownEntityTypes(shownEntityTypes.filter(e => e !== entity.name));
                                    }
                                }}
                                numberPositioned={positioned.length}
                                numberNotPositioned={notPositioned.length}
                                onClickArrow={() => onClickType(entity.name)}
                            ></EntityTypeRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}