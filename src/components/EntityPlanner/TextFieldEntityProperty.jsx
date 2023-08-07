import React from 'react';
import {
    TextField
} from '@material-ui/core';

export const TextFieldEntityProperty = ({ entityItem, entityType, propertyKey, changedValue, setChangedValue, parentEntities }) => {
    const isLat = propertyKey.endsWith('_lat');
    const isLng = propertyKey.endsWith('_lng');
    const key = (isLat || isLng) ? propertyKey.substring(0, propertyKey.length - 4) : propertyKey;
    const entityTypeProp = entityType.properties.find(p => p.key === key);
    const entityItemProp = entityItem.properties.find(p => p.key === key);
    const label = isLat ? 'Latitude' : (isLng ? 'Longitude' : entityTypeProp.label);

    const obtainSavedValue = () => {
        if (isLat || isLng) {
            if (entityItemProp && entityItemProp.val) {
                const coords = entityItemProp.val.coordinates;
                if (coords && coords.length >= 2) {
                    return coords[isLat ? 0 : 1] + '';
                }
            }
            return '';
        }

        for (const e of [entityItem, ...parentEntities]) {
            const entityItemProp = (e.properties || []).find(p => p.key === key);
            if (entityItemProp && entityItemProp.val !== undefined && entityItemProp.val !== null) {
                return entityItemProp.val + '';
            }
        }
        
        for (const e of [entityItem, ...parentEntities]) {
            const entityTypeProp = entityType.properties.find(p => p.key === key);
            if (entityTypeProp.defaultValue !== null && entityTypeProp.defaultValue !== undefined) {
                return entityTypeProp.defaultValue + '';
            }
        }

        return '';
    }

    const savedValue = obtainSavedValue();
    
    return (
        <TextField
            key={key}
            variant='outlined'
            label={label}
            size='small'
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
                setChangedValue(e.target.value === savedValue ? undefined : e.target.value);
            }}
            value={changedValue === undefined ? savedValue : changedValue}
        />
    )
}

export const entitySaveForTextFields = ({ entityType, entityItem, changedValues, setEntityProperties, setEntityLocations }) => {
    // Saving values except for location
    const propertiesChanged = [];
    for (let { key, type } of entityType.properties) {
        if (type !== 'location' && changedValues[key] !== undefined) {
            propertiesChanged.push({ key, val: changedValues[key] })
        }
    }

    if (propertiesChanged.length > 0) {
        setEntityProperties(entityItem.key, propertiesChanged);
    }

    // Saving just location
    const locationTypeProp = entityType.properties.find(({ type }) => type === 'location');
    if (locationTypeProp) {
        const lat = changedValues[locationTypeProp.key + '_lat'];
        const lng = changedValues[locationTypeProp.key + '_lng'];
        if (lat || lng) {
            const locationProp = entityItem.properties.find(itemProp => itemProp.key === locationTypeProp.key);
            // some default coord if user added lat without lng and without previous coords
            const coordinates = [
                parseFloat(lat) || locationProp.val.coordinates[0] || 31,
                parseFloat(lng) || locationProp.val.coordinates[1] || 34];
            setEntityLocations([entityItem.key], 'OSMMap', [coordinates]); // TODO get layerChosen
        }
    }
}
