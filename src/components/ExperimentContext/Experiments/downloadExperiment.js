import experimentAllDataQuery from '../utils/experimentAllDataQuery';
import config from '../../../config';
import JSZip from "jszip";

const fetchImageBlob = async (imageUrl) => {
    return new Promise((resolve) => {
        fetch(imageUrl)
            .then(response => response.blob())
            .then(image => resolve(image))
    })
}


const getImageFromMap = async (map) => {
    return new Promise(async (resolve) => {
        // const fileExtension = map.imageName.split('.')
        // const fileName = `${map.imageName}.${fileExtension[fileExtension.length - 1]}`
        const image = await fetchImageBlob(`${config.url}/${map.imageUrl}`)
        return resolve({
            ...map,
            imageUrl: image
        })

    })
}

const getImageFromLog = async (comment) => {
    return new Promise(async (resolve) => {
        const regex = /!\[(.*?)\]\((.*?)\)/g;
        const imagesData = [];
        let m;
        while ((m = regex.exec(comment)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            imagesData.push({ imageUrl: m[2], imageName: m[1] })
        }
        const images = await Promise.all(imagesData.map(async img => {
            const blob = await fetchImageBlob(img.imageUrl)
            return {
                imageUrl: blob,
                imageName: img.imageName
            }

        }))
        return resolve(images)
    })
}

const findEntityParent = (containedKey, entities) => {
    for (const e of entities) {
        if (e && e.containsEntities && e.containsEntities.includes(containedKey)) {
            return e;
        }
    }
    return undefined;
}

const findEntityParentHierarchy = (containedKey, entities) => {
    const parents = [];
    let curr = findEntityParent(containedKey, entities);
    while (curr) {
        parents.push(curr);
        curr = findEntityParent(curr.key, entities);
    }
    return parents;
}

const inheritProperty = (propKey, entityHierarchy, entitiesTypes) => {
    const entityTypeHierarchy = []
    for (const entityItem of entityHierarchy) {
        const entityItemProp = (entityItem.properties || []).find(p => p.key === propKey);
        if (entityItemProp) {
            const val = entityItemProp.val;
            if (val !== undefined && val !== null && val.trim() !== '') {
                return val + '';
            }
        }
        const entityType = entitiesTypes.find(({ key }) => key === entityItem.entitiesTypeKey);
        const entityTypeProp = entityType.properties.find(p => p.key === propKey);
        entityTypeHierarchy.push({ entityItem, entityItemProp, entityType, entityTypeProp });
        // if (!entityTypeProp.inheritable) {
        //     break;
        // }        
    }

    for (const { entityItem, entityItemProp, entityType, entityTypeProp } of entityTypeHierarchy) {
        if (entityTypeProp) {
            const val = entityTypeProp.defaultValue;
            if (val !== undefined && val !== null && val.trim() !== '') {
                return val + '';
            }
        }
    }

    return undefined;
}

export const inheritPropsEntity = (entityItem, entities, entitiesTypes) => {
    const parentHierarchy = findEntityParentHierarchy(entityItem.key, entities);
    const entityHierarchy = [entityItem, ...parentHierarchy];
    const entityType = entitiesTypes.find(({ key }) => key === entityItem.entitiesTypeKey);
    const properties = []
    for (const prop of entityType.properties) {
        const val = inheritProperty(prop.key, entityHierarchy, entitiesTypes);
        if (val !== undefined) {
            properties.push({ key: prop.key, val });
        }
    }
    return properties;
}

export const downloadExperiment = async (experiment, client) => {
    const expToDownload = { ...experiment };
    const data = await client.query({
        query: experimentAllDataQuery(experiment.project.id),
    });

    if (!data || !data.data.getAllExperimentData) {
        return;
    }

    const allData = data.data.getAllExperimentData;

    expToDownload.maps = await Promise.all(expToDownload.maps.map(async map => await getImageFromMap(map)))
    const logImages = await Promise.all(allData.logs.map(async log => await getImageFromLog(log.comment)))

    for (const trial of allData.trials) {
        for (const entityItem of trial.entities) {
            entityItem.properties = inheritPropsEntity(entityItem, trial.entities, allData.entityTypes);
        }
    }

    const json = JSON.stringify({ version: '2.0.0.', ...allData, experiment: expToDownload });

    const zip = JSZip();
    zip.file("data.json", json);
    expToDownload.maps.forEach(img => {
        zip.file(`images/${img.imageName}`, img.imageUrl, {
            binary: true
        });
    });

    logImages.forEach(array => {
        array.forEach(img => {
            zip.file(`images/${img.imageName}`, img.imageUrl, {
                binary: true
            });
        });
    })

    zip.generateAsync({ type: "blob" }).then(function (blob) {
        saveAs(blob, `experiment_${experiment.name}.zip`);
    });
}