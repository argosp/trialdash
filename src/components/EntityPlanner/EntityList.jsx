import React from 'react';
import { List } from '@material-ui/core';
import { EntityRow } from './EntityRow';
import { getEntityLocation, getEntityLocationProp } from './EntityUtils';

export const EntityList = ({ entities, selection, setSelection, removeEntityLocation, layerChosen }) => {
    const [lastIndex, setLastIndex] = React.useState();

    const handleSelectionClick = (index, doRange) => {
        let sel = [];
        if (!doRange) {
            if (selection.includes(index)) {
                sel = selection.filter(s => s !== index);
            } else {
                sel = selection.concat([index]);
            }
        } else if (lastIndex !== undefined) {
            const low = Math.min(index, lastIndex), high = Math.max(index, lastIndex);
            sel = selection.filter(s => s < low);
            for (let i = low; i <= high; ++i) {
                sel.push(i);
            }
            sel.concat(selection.filter(s => s > high));
        }
        setLastIndex(index);
        setSelection(sel.sort());
    }

    return (
        <div style={{ overflow: 'scroll', height: 'inherit', display: 'block' }}
        // inputProps={{ style: { overflow: 'scroll' } }}
        >
            <List>
                {
                    entities.map(devType =>
                        devType.items.map((dev, index) => {
                            const prop = getEntityLocationProp(dev, devType);
                            const entityLocation = (prop && prop.val) ? prop.val.coordinates : undefined;
                            const isEntityOnLayer = entityLocation && prop.val.name === layerChosen;
                            const entityLayerName = entityLocation ? prop.val.name : null;
                            return <EntityRow
                                key={dev.key}
                                dev={dev}
                                entityLocation={entityLocation}
                                isEntityOnLayer={isEntityOnLayer}
                                entityLayerName={entityLayerName}
                                isSelected={selection.includes(index)}
                                onClick={e => { handleSelectionClick(index, e.shiftKey) }}
                                onDisableLocation={() => { removeEntityLocation(index); }}
                            />
                        })
                    )
                }
            </List >
        </div >
    )
}