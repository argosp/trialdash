import React from 'react';
import { List } from '@material-ui/core';
import { EntityRow } from './EntityRow';
import { getEntityLocationProp } from './EntityUtils';
import { useStaging } from './StagingContext.jsx';

export const EntityList = ({ entities, removeEntitiesLocations, layerChosen }) => {
    const [lastIndex, setLastIndex] = React.useState();

    const {
        selection,
        setSelection
    } = useStaging();

    const shownItems = entities.flatMap(entity => entity.items.map(item => { return { entity, item }; }));

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
            for (const [index, { entity, item }] of shownItems.entries()) {
                if ((index < low || index > high) && selection.includes(item.key)) {
                    sel.push(item.key);
                }
            }
            for (let i = low; i <= high; ++i) {
                sel.push(shownItems[i].item.key);
            }
            setSelection(sel);
        }
        setLastIndex(index);
    }

    return (
        <div style={{ overflow: 'auto', height: '340px', display: 'block' }}
        // inputProps={{ style: { overflow: 'scroll' } }}
        >
            <List>
                {
                    shownItems.map(({ entity, item }, index) => {
                        const prop = getEntityLocationProp(item, entity);
                        const entityLocation = (prop && prop.val) ? prop.val.coordinates : undefined;
                        const isEntityOnLayer = entityLocation && prop.val.name === layerChosen;
                        const entityLayerName = entityLocation ? prop.val.name : null;
                        return <EntityRow
                            key={item.key}
                            dev={item}
                            entityLocation={entityLocation}
                            isEntityOnLayer={isEntityOnLayer}
                            entityLayerName={entityLayerName}
                            isSelected={selection.includes(item.key)}
                            onClick={e => { handleSelectionClick(item.key, index, e.shiftKey) }}
                            onDisableLocation={(doOnWholeList) => {
                                removeEntitiesLocations(doOnWholeList ? selection : [item.key]);
                            }}
                        />
                    })
                }
            </List >
        </div >
    )
}