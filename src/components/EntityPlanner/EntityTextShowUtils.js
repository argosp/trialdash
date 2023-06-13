export const entityShowSavedProperties = ({ entityType, entityItem }) => {
    return entityType.properties //.filter(({ type }) => type !== 'location')
        .flatMap(({ key: typePropertyKey, label, defaultValue, type }) => {
            const valprop = entityItem.properties.find(({ key: itemPropertyKey }) => itemPropertyKey === typePropertyKey);
            let val = '';
            if (valprop && valprop.val !== undefined && valprop.val !== null) {
                val = valprop.val;
            } else if (defaultValue !== null && defaultValue !== undefined) {
                val = defaultValue;
            }
            if (type !== 'location') {
                return { key: typePropertyKey, label, val, type };
            } else {
                return [
                    { key: typePropertyKey + '_lat', label: 'Latitude', val: val.coordinates[0], type },
                    { key: typePropertyKey + '_lng', label: 'Longitude', val: val.coordinates[1], type }
                ]
            }
        });
}

export const entitySaveProperties = ({ entityType, entityItem, shownValues, savedValues, setEntityProperties, setEntityLocations }) => {
    const changedValues = shownValues.filter(({ val }, i) => (savedValues[i].val + '').trim() !== (val + '').trim());

    // Saving values except for location
    const changedValuesNonLoc = changedValues.filter(({ type }) => type !== 'location');
    if (changedValuesNonLoc.length > 0) {
        const propertiesChanged = changedValuesNonLoc.map(({ key, val }) => { return { key, val } });
        setEntityProperties(entityItem.key, entityType.key, propertiesChanged);
    }

    // Saving just the location
    const changedValuesLoc = changedValues.filter(({ type }) => type === 'location');
    if (changedValuesLoc.length > 0) {
        // find the location property, we assume it exists because it is on the map
        const locationPropType = entityType.properties.find(({ type }) => type === 'location');
        const locationProp = entityItem.properties.find(({ key }) => key === locationPropType.key);

        // create new coordinates
        const coordinates = [...locationProp.val.coordinates];
        for (const { key, val } of changedValuesLoc) {
            const index = key.endsWith('_lat') ? 0 : 1;
            coordinates[index] = parseFloat(val);
        }

        setEntityLocations([entityItem.key], 'OSMMap', [coordinates]); // TODO get layerChosen
    }
}
