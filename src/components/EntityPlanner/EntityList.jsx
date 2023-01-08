import React from 'react';
import { List } from '@material-ui/core';
import { EntityRow } from './EntityRow';
import { useStaging } from './StagingContext.jsx';
import { EntityLocationButton } from './EntityLocationButton.jsx';

export const EntityList = ({ entityItems, removeEntitiesLocations, layerChosen }) => {
    const [lastIndex, setLastIndex] = React.useState();

    const {
        selection,
        setSelection
    } = useStaging();

    const handleSelectionClick = (devkey, index, doRange) => {
        if (!doRange) {
            if (selection.includes(devkey)) {
                setSelection(selection.filter(s => s !== devkey));
            } else {
                setSelection([...selection, devkey]);
            }
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
        <List>
            {
                entityItems.map(({ entityItem, location, isOnLayer, layerName }, index) => {
                    return <EntityRow
                        key={entityItem.key}
                        dev={entityItem}
                        isSelected={selection.includes(entityItem.key)}
                        onClick={e => { handleSelectionClick(entityItem.key, index, e.shiftKey) }}
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
                })
            }
        </List >
    )
}