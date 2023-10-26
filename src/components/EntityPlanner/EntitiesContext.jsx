import React, { createContext, useContext, useEffect, useState } from 'react';
import { WorkingContext } from '../AppLayout/AppLayout.jsx';
import { changeEntityLocationWithProp, getEntityLocationProp, getTypeLocationProp } from './EntityUtils';
import updateTrialContainsEntities from '../TrialContext/TrialForm/utils/trialMutationUpdateContainsEntities.js';

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

    const allProperties = JSON.stringify(trialEntities.flatMap(ent => {
        return (ent.properties || []).map(prop => prop.val).concat(ent.containsEntities || []);
    }));

    useEffect(() => {
        const flattenEntityTypes = () => {
            const entitiesTypeList = [];
            for (const typeList of Object.values(entitiesTypes)) {
                if (typeList && typeList.length && typeList[0].name && typeList[0].key) {
                    const oneType = { ...typeList[0] };
                    const locationProp = getTypeLocationProp(oneType);
                    if (locationProp) {
                        oneType.items = [];
                        for (let itemFromAll of Object.values(allEntities || {}).flat()) {
                            if (!itemFromAll.key || !itemFromAll.name || !itemFromAll.entitiesTypeKey) {
                                continue;
                            }

                            if (typeList[0].key !== itemFromAll.entitiesTypeKey) {
                                continue;
                            }

                            const itemFromTrial = trial.entities.find(e => e.key === itemFromAll.key) || {};
                            const { properties: _, ...nonPropsFromTrial } = itemFromTrial;

                            const propsFromAll = Object.fromEntries((itemFromAll.properties || []).map(x => [x.key, x]));
                            const propsFromTrial = Object.fromEntries((itemFromTrial.properties || []).map(x => [x.key, x]));
                            const properties = Object.values({ ...propsFromAll, ...propsFromTrial });

                            const item = { ...itemFromAll, ...nonPropsFromTrial, properties };

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

                        sortNameKeyInplace(oneType.items);

                        entitiesTypeList.push(oneType);
                    }
                }
            }
            sortNameKeyInplace(entitiesTypeList);
            return entitiesTypeList;
        }

        const newEntities = flattenEntityTypes();
        setEntities(newEntities);
    }, [entitiesTypes, trialEntities, allEntities, allProperties]);

    const findEntityItem = (entityItemKey) => {
        for (const entityType of entities) {
            for (const entityItem of (entityType.items || [])) {
                if (entityItem.key === entityItemKey) {
                    return { entityItem, entityType };
                }
            }
        }
        return { entityItem: undefined, entityType: undefined };
    }

    const setEntityLocations = async (entityItemKeys, layerChosen, newLocations = [undefined]) => {
        setWorking(true);
        const start = Date.now();

        const changes = [];
        for (const [index, entityItemKey] of entityItemKeys.entries()) {
            const { entityItem, entityType } = findEntityItem(entityItemKey);
            if (entityItem) {
                const locationPropKey = getTypeLocationProp(entityType);
                if (locationPropKey) {
                    const coordinates = newLocations[Math.min(index, newLocations.length - 1)];
                    changes.push({
                        key: entityItemKey,
                        type: "entity",
                        entitiesTypeKey: entityType.key,
                        properties: [{
                            key: locationPropKey,
                            val: JSON.stringify({ name: layerChosen, coordinates })
                        }]
                    });
                }
            }
        }

        // console.log('calling updateLocation', changes);

        try {
            await updateLocation(...changes);
            console.log('update entities took ', Date.now() - start, 'ms');
            // setEntities(newEntities);
        } catch (e) {
            console.log(e);
            setWorking(false);
            throw e;
        }
        setWorking(false);
    }

    /** @deprecated TODO: use setEntitiesProperties directly */
    const setEntityProperties = async (entityItemKey, propertiesChanged, containsEntitiesKeys = undefined) => {
        await setEntitiesProperties([{ entityItemKey, propertiesChanged, containsEntitiesKeys }]);
    }

    const setEntitiesProperties = async (entityItemKeyPropsChangedContainsKeys) => {
        setWorking(true);
        
        const start = Date.now();
        const updatedTrial = {
            ...trial
        }

        for (const { entityItemKey, propertiesChanged, containsEntitiesKeys } of entityItemKeyPropsChangedContainsKeys) {
            const entityOnTrial = updatedTrial.entities.find(({ key }) => entityItemKey === key);
            if (!entityOnTrial) {
                throw 'problem with entity ' + entityItemKey;
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
                if (containsEntitiesKeys) {
                    entityOnTrial.containsEntities = containsEntitiesKeys;
                }
            }
        }

        await submitTrial(updatedTrial);
        console.log('setEntityProperties took ', Date.now() - start, 'ms');
        
        setWorking(false);
    }

    const findEntityParent = (childEntityItem) => {
        const containedKey = childEntityItem.key;
        for (const entityType of entities) {
            for (const entityItem of entityType.items) {
                if (entityItem.containsEntities && entityItem.containsEntities.includes(containedKey)) {
                    return { entityItem, entityType };
                }
            }
        }
        return { entityItem: undefined, entityType: undefined };
    }

    // const findEntityParentHierarchy = (containedKey) => {
    //     const parents = [];
    //     let curr = findEntityParent(containedKey);
    //     while (curr) {
    //         parents.push(curr);
    //         curr = findEntityParent(curr.key);
    //     }
    //     return parents;
    // }

    const getLocation = (entityItem, entityType) => {
        while (entityItem && entityType) {
            const locationProp = getEntityLocationProp(entityItem, entityType);
            const location = (locationProp && locationProp.val) ? locationProp.val.coordinates : undefined;
            if (location) {
                return { location, locationProp };
            }
            ({ entityItem, entityType } = findEntityParent(entityItem));
        }
        return { location: undefined, locationProp: undefined };
    }

    const getEntityItems = (filterEntityType, layerChosen) => {
        const filteredByType = entities.filter(e => filterEntityType.includes(e.name));
        const items = filteredByType.flatMap(entityType => {
            return entityType.items.map(entityItem => {
                const { location, locationProp } = getLocation(entityItem, entityType);
                const isOnLayer = location && locationProp.val.name === layerChosen;
                const layerName = location ? locationProp.val.name : null;
                return { entityItem, entityType, location, isOnLayer, layerName };
            });
        });
        return items;
    }

    const store = {
        entities,
        setEntityLocations,
        getEntityItems,
        setEntityProperties,
        setEntitiesProperties,
        findEntityParent,
    }

    return (
        <EntitiesContext.Provider value={store}>
            {children}
        </EntitiesContext.Provider>
    )
}
