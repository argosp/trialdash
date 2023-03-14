import React, { createContext, useContext, useEffect, useState } from 'react';
import { WorkingContext } from '../AppLayout';
import { changeEntityLocationWithProp, findEntitiesChanged, getEntityLocationProp, getTypeLocationProp } from './EntityUtils';
import { changeEntityLocation } from './EntityUtils';

export const EntitiesContext = createContext(null);

export const useEntities = () => useContext(EntitiesContext);

export const EntitiesProvider = ({
    children,
    client,
    trialEntities,
    updateLocation,
    entitiesTypes,
    experimentId,
    submitTrial,
    trial,
    allEntities
}) => {
    const [entities, setEntities] = useState([]);
    const { setWorking } = useContext(WorkingContext);

    const sortNameKeyInplace = (items) => {
        return items.sort((a, b) => {
            return (a.name + ";" + a.key).localeCompare(b.name + ";" + b.key);
        });
    }

    const allProperties = JSON.stringify(trialEntities.flatMap(ent => (ent.properties || []).map(prop => prop.val)));

    useEffect(() => {
        const flattenEntityTypes = () => {
            const entitiesTypeList = [];
            for (const typeList of Object.values(entitiesTypes)) {
                if (typeList && typeList.length && typeList[0].name && typeList[0].key) {
                    const oneType = { ...typeList[0] };
                    const locationProp = getTypeLocationProp(oneType);
                    if (locationProp) {
                        oneType.items = [];
                        for (const itemFromTrial of trialEntities) {
                            if (itemFromTrial.entitiesTypeKey === oneType.key) {
                                const item = { ...itemFromTrial, properties: [...(itemFromTrial.properties || [])] };
                                if (allEntities) {
                                    const itemFromAll = allEntities[item.key];
                                    if (itemFromAll && itemFromAll.length && itemFromAll[0].name) {
                                        item.name = itemFromAll[0].name;
                                    }
                                }

                                const location = item.properties.find(entprop => entprop.key === locationProp);
                                if (location) {
                                    try {
                                        const locparsed = JSON.parse(location.val);
                                        changeEntityLocationWithProp(item, locationProp, locparsed.coordinates, locparsed.name);
                                    } catch (e) {
                                    }
                                }

                                oneType.items.push(item);
                            }
                        }

                        sortNameKeyInplace(oneType.items);

                        entitiesTypeList.push(oneType);
                    }
                }
            }
            sortNameKeyInplace(entitiesTypeList);
            return entitiesTypeList;
        }

        setEntities(flattenEntityTypes());
    }, [entitiesTypes, trialEntities, allEntities, allProperties]);

    const handleChangeEntities = async (newEntities) => {
        setWorking(true);
        const changedEntities = findEntitiesChanged(entities, newEntities);

        // Calling updateLocation one change at a time, otherwise it crushes.
        const start = Date.now();
        const changes = changedEntities.map(({ dev: newDev, type: newDevType }) => {
            const locationProp = getEntityLocationProp(newDev, newDevType);
            return {
                key: newDev.key,
                type: "entity",
                entitiesTypeKey: newDevType.key,
                properties: [{
                    key: locationProp.key,
                    val: JSON.stringify(locationProp.val)
                }]
            };
        });
        // console.log('calling updateLocation', changes);
        await updateLocation(...changes);
        console.log('update entities took ', Date.now() - start, 'ms');

        setEntities(newEntities);
        setWorking(false);
    };

    const changeLocations = (entityItemKeys, layerChosen, newLocations = [undefined]) => {
        let tempEntities = JSON.parse(JSON.stringify(entities));
        // TODO: this can be optimized
        for (const [i, k] of entityItemKeys.entries()) {
            const loc = newLocations[Math.min(i, newLocations.length - 1)];
            let found = false;
            for (let t = 0; !found && t < tempEntities.length; ++t) {
                const typeEntities = tempEntities[t];
                for (let j = 0; !found && j < typeEntities.items.length; ++j) {
                    if (typeEntities.items[j].key === k) {
                        changeEntityLocation(typeEntities.items[j], typeEntities, loc, layerChosen);
                        found = true;
                    }
                }
            }
        }
        return tempEntities;
    };

    const setEntityLocations = (entityItemKeys, layerChosen, newLocations = [undefined]) => {
        handleChangeEntities(changeLocations(entityItemKeys, layerChosen, newLocations));
    }

    const setEntityProperties = async (entityItemKey, entityTypeKey, propertiesChanged) => {
        setWorking(true);
        const start = Date.now();
        const updatedTrial = {
            ...trial
        }
        const entityOnTrial = updatedTrial.entities.find(({ key }) => entityItemKey === key);
        if (!entityOnTrial) {
            console.log('problem with entity', entityOnTrial);
        } else {
            entityOnTrial.properties = [...(entityOnTrial.properties || [])];
            for (const changedProp of propertiesChanged) {
                const newProp = { ...changedProp };
                const foundProp = entityOnTrial.properties.findIndex(prop => prop.key === changedProp.key);
                if (foundProp === -1) {
                    entityOnTrial.properties.push(newProp);
                } else {
                    entityOnTrial.properties.splice(foundProp, 1, newProp);
                }
            }
            await submitTrial(updatedTrial);
            console.log('setEntityProperties took ', Date.now() - start, 'ms');
        }
        setWorking(false);
    }

    const getEntityItems = (filterEntityType, layerChosen) => {
        const filteredByType = entities.filter(e => filterEntityType.includes(e.name));
        const items = filteredByType.flatMap(entityType => entityType.items.map(entityItem => {
            const prop = getEntityLocationProp(entityItem, entityType);
            const location = (prop && prop.val) ? prop.val.coordinates : undefined;
            const isOnLayer = location && prop.val.name === layerChosen;
            const layerName = location ? prop.val.name : null;
            return { entityItem, entityType, location, isOnLayer, layerName };
        }));
        return items;
    }

    const store = {
        entities,
        setEntityLocations,
        getEntityItems,
        setEntityProperties,
    }

    return (
        <EntitiesContext.Provider value={store}>
            {children}
        </EntitiesContext.Provider>
    )
}
