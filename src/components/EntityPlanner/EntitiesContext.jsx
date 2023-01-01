import React, { createContext, useContext } from 'react';
import { changeEntityLocationWithProp, findEntitiesChanged, getEntityLocationProp, getTypeLocationProp } from './EntityUtils';
import entitiesTrialQuery from './utils/entitiesTrialQuery';
import { changeEntityLocation, getEntityLocation } from './EntityUtils';

export const EntitiesContext = createContext(null);

export const useEntities = () => useContext(EntitiesContext);

export const EntitiesProvider = ({ children, client, trialEntities, updateLocation, entitiesTypes, experimentId }) => {
    const [entities, setEntities] = React.useState([]);
    const [working, setWorking] = React.useState(false);

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

    React.useEffect(() => {
        (async () => {
            const entityTypesAsList = Object.values(entitiesTypes).filter(dtlst => dtlst.length).flat();
            const newdevs = entityTypesAsList.filter(dt => dt.name && dt.key && getTypeLocationProp(dt));
            newdevs.sort((a, b) => (a.name + ";" + a.key).localeCompare(b.name + ";" + b.key));
            setWorking(0);
            let done = 0;
            for await (const devtype of newdevs) {
                const locationProp = getTypeLocationProp(devtype);
                const dataDev = await client.query({ query: entitiesTrialQuery(experimentId, devtype.key, undefined) });
                done += 1;
                setWorking(done / newdevs.length * 100);
                devtype.items = dataDev.data.entities.map(devitem => entityWithTrialLocation(devitem, locationProp));
                devtype.items.sort((a, b) => (a.name + ";" + a.key).localeCompare(b.name + ";" + b.key));
                if (done === newdevs.length) {
                    setEntities(newdevs);
                }
                setTimeout(() => setWorking(false), 500);
            }
        })()
    }, [trialEntities]);

    const handleChangeEntities = (newEntities) => {
        setWorking(true);
        const changedEntities = findEntitiesChanged(entities, newEntities);
        const changedDetails = changedEntities.map(changed => {
            const { dev: newDev, type: newDevType } = changed;
            const locationProp = getEntityLocationProp(newDev, newDevType);
            const changeProps = [{ key: locationProp.key, val: JSON.stringify(locationProp.val) }];
            return { key: newDev.key, type: "entity", entitiesTypeKey: newDevType.key, properties: changeProps };
        });

        // Calling updateLocation one change at a time, otherwise it crushes.
        const uploc = () => {
            if (changedDetails.length) {
                setWorking((1 - changedDetails.length / changedEntities.length) * 100);
                const ch = changedDetails.pop();
                console.log('change', ch);
                updateLocation(ch)
                    .then(uploc);
            } else {
                setWorking(100);
                setTimeout(() => setWorking(false), 500);
            }
        }
        uploc();
        setEntities(newEntities);
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

    const getEntityItemsLocations = (layerChosen, filterType = undefined) => {
        const ret = [];
        entities.forEach(entityTypeObj => {
            const entityType = entityTypeObj.name;
            if (!filterType || (entityType === filterType)) {
                entityTypeObj.items.forEach((entityItem, entityItemIndex) => {
                    const location = getEntityLocation(entityItem, entityTypeObj, layerChosen);
                    if (location) {
                        ret.push({ entityItem, entityItemIndex, entityType, location });
                    }
                });
            }
        })
        return ret;
    }

    const store = {
        working,
        entities,
        setEntityLocations,
        getEntityItemsLocations
    }

    return (
        <EntitiesContext.Provider value={store}>
            {children}
        </EntitiesContext.Provider>
    )
}
