import React, { useEffect } from 'react';
import { EntityTypeRow } from './EntityTypeRow.jsx';
import { Table, TableContainer, TableHead, TableCell, TableRow, TableBody, Paper } from '@mui/material'

export const TypeChooser = ({ shownEntityTypes, setShownEntityTypes, entities, entityItems, showTableOfType, setShowTableOfType, history, match }) => {

    useEffect(() => {
        if (shownEntityTypes.length === 0 && entities.length > 0) {
            setShownEntityTypes(entities.map(e => e.name));
        }
    }, [shownEntityTypes, entities])

    return entities.length === 0 ? null :
        (
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
                        {entities.map((entity, i) => {
                            const items = entityItems.filter(({ entityType }) => entityType.name === entity.name);
                            const positioned = items.filter(({ location }) => location);
                            const notPositioned = items.filter(({ location }) => !location);
                            return (
                                <EntityTypeRow
                                    key={i}
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
                                    isOpenArrow={showTableOfType === entity.name}
                                    setIsOpenArrow={(yes) => setShowTableOfType(yes ? entity.name : '')}
                                    history={history}
                                    match={match}
                                ></EntityTypeRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
}