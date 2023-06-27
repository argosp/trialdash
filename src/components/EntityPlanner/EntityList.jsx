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
import { DomEvent } from 'leaflet';

export const EntityList = ({ entityItems, removeEntitiesLocations, layerChosen, showProperties }) => {
    const [lastIndex, setLastIndex] = React.useState();

    const {
        selection,
        setSelection,
        toggleIsSelected
    } = useStaging();

    const setRangeSelected = (lowInclusive, highInclusive, makeSelected) => {
        const sel = [];
        for (const [index, { entityItem }] of entityItems.entries()) {
            if ((index < lowInclusive || index > highInclusive) && selection.includes(entityItem.key)) {
                sel.push(entityItem.key);
            }
        }
        if (makeSelected) {
            for (let i = lowInclusive; i <= highInclusive; ++i) {
                sel.push(entityItems[i].entityItem.key);
            }
        }
        setSelection(sel);
    }

    const handleSelectionClick = (devkey, index, doRange, e) => {
        DomEvent.stop(e);
        if (!doRange) {
            toggleIsSelected(devkey);
        } else if (lastIndex !== undefined) {
            setRangeSelected(Math.min(index, lastIndex), Math.max(index, lastIndex), true);
        }
        setLastIndex(index);
    }

    const handleSetSelectedAllList = (makeSelected, index) => {
        setRangeSelected(0, entityItems.length - 1, makeSelected);
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
    const shownKeysWithPos = entityItems.filter(x => x.location).map(x => x.entityItem.key);

    return (
        <>
            {itemsGrouped.map((itemsOfType, i) => {
                return (
                    <TableContainer component={Paper} key={i}>
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
                                                onClick={e => handleSelectionClick(entityItem.key, index, e.shiftKey, e)}
                                                nameMenuItems={[
                                                    {
                                                        label: 'Select all',
                                                        callback: () => handleSetSelectedAllList(true, index)
                                                    },
                                                    {
                                                        label: 'Deselect all',
                                                        callback: () => handleSetSelectedAllList(false, index)
                                                    },
                                                ]}
                                            >
                                                {!location ? null :
                                                    <EntityLocationButton
                                                        entityLocation={location}
                                                        isEntityOnLayer={isOnLayer}
                                                        entityLayerName={layerName}
                                                        onDisableLocation={(doOnWholeList) => {
                                                            removeEntitiesLocations(doOnWholeList ? shownKeysWithPos : [entityItem.key]);
                                                        }}
                                                        menuItems={[
                                                            {
                                                                label: 'Remove locations of this list (shift+click)',
                                                                callback: () => removeEntitiesLocations(shownKeysWithPos)
                                                            },
                                                            {
                                                                label: 'Remove locations of selected',
                                                                callback: () => removeEntitiesLocations(selection)
                                                            },
                                                            {
                                                                label: 'Remove location of this one (click)',
                                                                callback: () => removeEntitiesLocations([entityItem.key])
                                                            },
                                                        ]}
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