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

const inheritProps = (trial, entitiesTypes) => {
    return trial;
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

    const { entityTypes } = allData;
    allData.trials = allData.trials.map(trial => inheritProps(trial, entityTypes));

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