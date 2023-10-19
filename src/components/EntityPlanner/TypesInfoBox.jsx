import React, { useState } from 'react';
import {
    Grid,
} from '@mui/material'
import { EntityList } from "./EntityList";
import { TypeChooser } from "./TypeChooser";

export const TypesInfoBox = ({
    shownEntityItems,
    shownEntityTypes,
    setShownEntityTypes,
    showTableOfType,
    setShowTableOfType,
    entities,
    layerChosen,
    history,
    match,
}) => {
    const [searchItemName, setSearchItemName] = useState('');
    const itemsList = shownEntityItems.filter(({ entityItem, entityType }) => {
        if (entityType.name !== showTableOfType) {
            return false;
        } else if (searchItemName !== '' && !entityItem.name.includes(searchItemName)) {
            return false;
        }
        return true;
    });
    return (
        <Grid container direction='row'>
            <Grid item>
                <TypeChooser
                    shownEntityTypes={shownEntityTypes}
                    setShownEntityTypes={setShownEntityTypes}
                    entities={entities}
                    entityItems={shownEntityItems}
                    showTableOfType={showTableOfType}
                    setShowTableOfType={setShowTableOfType}
                    onClickType={(t) => setShowTableOfType(t === showTableOfType ? '' : t)}
                    history={history}
                    match={match}
                />
            </Grid>
            <Grid item>
                {showTableOfType &&
                    <input type='text'
                        value={searchItemName}
                        onChange={e => setSearchItemName((e.target.value + '').trim())}
                    ></input>
                }
                <EntityList
                    style={{
                        overflow: 'auto',
                        display: 'block'
                    }}
                    entityItems={itemsList}
                    removeEntitiesLocations={(keys) => setEntityLocations(keys, layerChosen)}
                    layerChosen={layerChosen}
                    showProperties={false}
                />
            </Grid>
        </Grid>
    )
}