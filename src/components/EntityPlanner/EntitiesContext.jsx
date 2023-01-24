import React, { createContext, useContext, useEffect, useState } from 'react';
import { changeEntityLocationWithProp, findEntitiesChanged, getEntityLocationProp, getTypeLocationProp } from './EntityUtils';
import entitiesTrialQuery from './utils/entitiesTrialQuery';
import { changeEntityLocation } from './EntityUtils';

export const EntitiesContext = createContext(null);

export const useEntities = () => useContext(EntitiesContext);

export const EntitiesProvider = ({ children, client, trialEntities, updateLocation, entitiesTypes, experimentId }) => {
    const [entities, setEntities] = useState([]);
    const [working, setWorking] = useState(false);

    const entityWithTrialLocation = (devitem, locationPropOnDevType) => {
        const entityEntityOnTrial = trialEntities.find(ent => ent.key === devitem.key);
        if (entityEntityOnTrial) {
            const locationOnTrial = entityEntityOnTrial.properties.find(entprop => entprop.key === locationPropOnDevType);
            if (locationOnTrial) {
                try {
                    const locparsed = JSON.parse(locationOnTrial.val);
                    changeEntityLocationWithProp(devitem, locationPropOnDevType, locparsed.coordinates, locparsed.name);
                } catch (e) {
                }
            }
        }
        return devitem;
    };

    useEffect(() => {
        (async () => {
            const entityTypesAsList = Object.values(entitiesTypes).filter(dtlst => dtlst.length).flat();
            const newdevs = entityTypesAsList.filter(dt => dt.name && dt.key && getTypeLocationProp(dt));
            newdevs.sort((a, b) => (a.name + ";" + a.key).localeCompare(b.name + ";" + b.key));
            setWorking(0);
            await Promise.allSettled(newdevs.map(async devtype => {
                const locationProp = getTypeLocationProp(devtype);
                const dataDev = await client.query({ query: entitiesTrialQuery(experimentId, devtype.key, undefined) });
                devtype.items = dataDev.data.entities.map(devitem => entityWithTrialLocation(devitem, locationProp));
                devtype.items.sort((a, b) => (a.name + ";" + a.key).localeCompare(b.name + ";" + b.key));
                setWorking(newdevs.filter(x => x.items).length / newdevs.length * 100);
            }));
            setEntities(newdevs);
            setTimeout(() => setWorking(false), 100);
        })()
    }, [trialEntities]);

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
        console.log('calling updateLocation', changes);
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
        working,
        entities,
        setEntityLocations,
        getEntityItems
    }

    return (
        <EntitiesContext.Provider value={store}>
            {children}
        </EntitiesContext.Provider>
    )
}
