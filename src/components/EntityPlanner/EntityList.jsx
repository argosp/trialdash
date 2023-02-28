import React from 'react';
import {
    Table,
    TableContainer,
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

    const groupItemsByType = (entityItems, allInOneGroup) => {
        if (entityItems.length === 0) {
            return [];
        }
        if (allInOneGroup || entityItems.length === 0) {
            return [entityItems.map((x, index) => { return { ...x, index } })];
        }
        const itemsGrouped = [];
        let lastTypeKey = undefined;
        entityItems.forEach((t, index) => {
            if (t.entityType.key === lastTypeKey) {
                itemsGrouped.at(-1).push({ ...t, index });
            } else {
                itemsGrouped.push([{ ...t, index }]);
                lastTypeKey = t.entityType.key;
            }
        });
        return itemsGrouped;
    }

    const itemsGrouped = groupItemsByType(entityItems, !showProperties);

    return (
        <>
            {itemsGrouped.map(itemsOfType => {
                return (
                    <TableContainer component={Paper}>
                        <Table size="small">
                            {/* <TableHead>
                                {!showProperties ? null :
                                    <TableRow>
                                        <TableCell style={{ fontWeight: 'bolder' }}>
                                            {entityType.name}
                                        </TableCell>
                                        {shownPropertiesDetails.map(({ label }) => (
                                            <TableCell padding='none' style={{ textAlign: 'center' }}>
                                                {label}
                                            </TableCell>
                                        ))}
                                        <TableCell align="right" padding='none'></TableCell>
                                    </TableRow>
                                }
                            </TableHead> */}
                            <TableBody>
                                {
                                    itemsOfType.map(({ entityItem, entityType, location, isOnLayer, layerName }, index) => {
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
            })}
        </>
    )
}