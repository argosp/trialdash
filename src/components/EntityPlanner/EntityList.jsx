import React from 'react';
import {
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    Paper,
} from '@material-ui/core'
import { EntityRow } from './EntityRow';
import { useStaging } from './StagingContext.jsx';
import { EntityLocationButton } from './EntityLocationButton.jsx';

export const EntityList = ({ entityItems, removeEntitiesLocations, layerChosen, showProperties }) => {
    const [lastIndex, setLastIndex] = React.useState();

    const {
        selection,
        setSelection,
        toggleIsSelected
    } = useStaging();

    const handleSelectionClick = (devkey, index, doRange) => {
        if (!doRange) {
            toggleIsSelected(devkey);
        } else if (lastIndex !== undefined) {
            const low = Math.min(index, lastIndex);
            const high = Math.max(index, lastIndex);

            const sel = [];
            for (const [index, { entityItem }] of entityItems.entries()) {
                if ((index < low || index > high) && selection.includes(entityItem.key)) {
                    sel.push(entityItem.key);
                }
            }
            for (let i = low; i <= high; ++i) {
                sel.push(entityItems[i].entityItem.key);
            }
            setSelection(sel);
        }
        setLastIndex(index);
    }

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    {entityItems.length === 0 ? null :
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bolder' }}>Name</TableCell>
                            {/* <TableCell align="right">Positioned</TableCell> */}
                            <TableCell align="right" padding='none'></TableCell>
                            {/* <TableCell align="right" padding='none'></TableCell> */}
                        </TableRow>
                    }
                </TableHead>
                <TableBody>
                    {
                        entityItems.map(({ entityItem, entityType, location, isOnLayer, layerName }, index) => {
                            return (
                                <EntityRow
                                    key={entityItem.key}
                                    entityItem={entityItem}
                                    entityType={entityType}
                                    showProperties={showProperties}
                                    onClick={e => handleSelectionClick(entityItem.key, index, e.shiftKey)}
                                >
                                    {!location ? null :
                                        <EntityLocationButton
                                            entityLocation={location}
                                            isEntityOnLayer={isOnLayer}
                                            entityLayerName={layerName}
                                            onDisableLocation={(doOnWholeList) => {
                                                removeEntitiesLocations(doOnWholeList ? selection : [entityItem.key]);
                                            }}
                                        />
                                    }
                                </EntityRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer >
    )
}