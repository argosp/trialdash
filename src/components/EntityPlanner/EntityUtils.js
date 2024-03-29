export const getTypeLocationProp = (entitiesType) => {
    const locationProp = entitiesType.properties.find(prop => prop.type === "location");
    if (!locationProp || !locationProp.key || locationProp.key === '') return undefined;
    return locationProp.key;
}

export const getEntityLocationProp = (entity, entitiesType) => {
    const key = getTypeLocationProp(entitiesType);
    const prop = entity.properties.find(pr => pr.key === key);
    if (!prop || !prop.val) return undefined;
    return prop;
}

export const getEntityLocation = (entity, entitiesType, locationKind) => {
    const prop = getEntityLocationProp(entity, entitiesType);
    if (prop && prop.val && prop.val.name === locationKind) {
        return prop.val.coordinates;
    }
    return undefined;
}

export const changeEntityLocationWithProp = (entity, locationPropKey, newLocation, locationKind) => {
    const pos = entity.properties.findIndex(pr => pr.key === locationPropKey);
    if (pos !== -1) {
        entity.properties.splice(pos, 1);
    }
    entity.properties.push({
        key: locationPropKey,
        val: { name: locationKind, coordinates: newLocation }
    });
}

export const sortEntities = (entitiesTypes) => {
    entitiesTypes.sort((a, b) => (a.name + ";" + a.key).localeCompare(b.name + ";" + b.key));
    entitiesTypes.forEach(devType => {
        devType.items.sort((a, b) => (a.name + ";" + a.key).localeCompare(b.name + ";" + b.key));
    });
    return entitiesTypes;
}
