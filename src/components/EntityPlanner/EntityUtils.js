export const getTypeLocationProp = (entitiesType) => {
  const locationProp = entitiesType.properties.find((prop) => prop.type === 'location');
  if (!locationProp || !locationProp.key || locationProp.key === '') return undefined;
  return locationProp.key;
};

export const getEntityLocationProp = (entity, entitiesType) => {
  const key = getTypeLocationProp(entitiesType);
  const prop = entity.properties.find((pr) => pr.key === key);
  if (!prop || !prop.val) return undefined;
  return prop;
};

export const getEntityLocation = (entity, entitiesType, locationKind) => {
  const prop = getEntityLocationProp(entity, entitiesType);
  if (prop && prop.val && prop.val.name === locationKind) {
    return prop.val.coordinates;
  }
  return undefined;
};

export const changeEntityLocation = (entity, entitiesType, newLocation, locationKind) => {
  const locationPropKey = getTypeLocationProp(entitiesType);
  changeEntityLocationWithProp(entity, locationPropKey, newLocation, locationKind);
};

export const changeEntityLocationWithProp = (
  entity,
  locationPropKey,
  newLocation,
  locationKind
) => {
  if (entity && entity.properties) {
    const pos = entity.properties.findIndex((pr) => pr.key === locationPropKey);
    if (pos !== -1) {
      entity.properties.splice(pos, 1);
    }
    entity.properties.push({
      key: locationPropKey,
      val: { name: locationKind, coordinates: newLocation },
    });
  }
};

export const sortEntities = (entitiesTypes) => {
  entitiesTypes.sort((a, b) => (a.name + ';' + a.key).localeCompare(b.name + ';' + b.key));
  entitiesTypes.forEach((devType) => {
    devType.items.sort((a, b) => (a.name + ';' + a.key).localeCompare(b.name + ';' + b.key));
  });
  return entitiesTypes;
};

export const findEntitiesChanged = (oldEntityTypes, newEntityTypes) => {
  let ret = [];
  newEntityTypes.forEach((newDevType) => {
    const oldDevType = oldEntityTypes.find((ty) => ty.key === newDevType.key);
    if (oldDevType && oldDevType.items && newDevType.items) {
      newDevType.items.forEach((newDev) => {
        const oldDev = oldDevType.items.find((d) => d.key === newDev.key);
        if (oldDev && JSON.stringify(oldDev) !== JSON.stringify(newDev)) {
          ret.push({ dev: newDev, type: newDevType });
        }
      });
    }
  });
  return ret;
};
