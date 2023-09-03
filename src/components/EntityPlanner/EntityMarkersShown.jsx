import React, { useState } from 'react';
import {
    LocationOff,
    PlaylistAdd
} from "@mui/icons-material";
import { ReactComponent as PlaylistRemove } from './Icons/PlaylistRemove.svg';
import { ButtonTooltip } from "./ButtonTooltip"
import { EntityMarker } from "./EntityMarker"
import { useEntities } from './EntitiesContext';
import { useSelection } from './SelectionContext';

export const EntityMarkersShown = ({ shownEntityItems, shownEntityTypes, shouldShowName }) => {
    const {
        entities,
        setEntityLocations,
        getEntityItems
    } = useEntities();

    const {
        selection,
        setSelection,
        toggleIsSelected,
        popTopSelection
    } = useSelection();

    return (
        <>
            {
                shownEntityItems.filter(x => x.isOnLayer).map(({ entityItem, entityType, location }) => (
                    <EntityMarker
                        key={entityItem.key}
                        entityItem={entityItem}
                        entityType={entityType}
                        devLocation={location}
                        isSelected={selection.includes(entityItem.key)}
                        isTypeSelected={shownEntityTypes.includes(entityType.name)}
                        shouldShowName={shouldShowName}
                        onClick={() => toggleIsSelected(entityItem.key)}
                    >
                        <ButtonTooltip tooltip="Remove location" onClick={e => setEntityLocations([entityItem.key], layerChosen)}>
                            <LocationOff />
                        </ButtonTooltip>
                        <ButtonTooltip tooltip={selection.includes(entityItem.key) ? "Remove from list" : "Add to list"}
                            onClick={e => toggleIsSelected(entityItem.key)}
                        >
                            {selection.includes(entityItem.key) ? <PlaylistRemove /> : <PlaylistAdd />}
                        </ButtonTooltip>
                    </EntityMarker>
                ))
            }
        </>
    )
}