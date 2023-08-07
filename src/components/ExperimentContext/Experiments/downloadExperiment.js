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

export const downloadExperiment = async (experiment, client) => {
    const expToDownload = { ...experiment }
    client.query({
        query: experimentAllDataQuery(experiment.project.id),
    }).then(async (data) => {
        if (data && data.data.getAllExperimentData) {
            expToDownload.maps = await Promise.all(expToDownload.maps.map(async map => await getImageFromMap(map)))
            const logImages = await Promise.all(data.data.getAllExperimentData.logs.map(async log => await getImageFromLog(log.comment)))
            const zip = JSZip();
            zip.file("data.json", JSON.stringify({ version: '2.0.0.', ...data.data.getAllExperimentData, experiment: expToDownload }));
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

    });
}