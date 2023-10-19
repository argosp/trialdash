import React from 'react';
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
                    <input type='text'></input>
                }
                <EntityList
                    style={{
                        overflow: 'auto',
                        display: 'block'
                    }}
                    entityItems={shownEntityItems.filter(({ entityType }) => entityType.name === showTableOfType)}
                    removeEntitiesLocations={(keys) => setEntityLocations(keys, layerChosen)}
                    layerChosen={layerChosen}
                    showProperties={false}
                />
            </Grid>
        </Grid>
    )
}