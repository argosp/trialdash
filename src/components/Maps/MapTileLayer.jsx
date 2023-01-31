import React from 'react';
import {
    TileLayer,
} from "react-leaflet";

const urlprefix = 'REACT_APP_MAP_URL';
const attrprefix = 'REACT_APP_MAP_ATTRIBUTION';

const defaultTileUrls = [
    'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga',
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png',
    'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
];

const detailsForUrls = [
    { part: 'carto', name: 'Carto', attr: '&copy; <a href="https://carto.com">Carto</a> contributors' },
    { part: 'google', name: 'Google', attr: '&copy; <a href="https://google.com">Google</a>' },
    { part: 'osm.org', name: 'OSMMap', attr: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' },
]

// const attributionForTile = (url, attr) => {
//     if (attr && attr.trim().length > 0) {
//         return attr;
//     } else if (url.toLowerCase().includes('carto')) {
//         return '&copy; <a href="https://carto.com">Carto</a> contributors';
//     } else if (url.toLowerCase().includes('google')) {
//         return '&copy; <a href="https://google.com">Google</a>';
//     } else if (url.toLowerCase().includes('osm')) {
//         return '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
//     }
//     return '';
// }

export const obtainTileUrls = () => {
    const urlKeys = Object.keys(process.env).filter(x => x.startsWith(urlprefix));
    if (urlKeys.length === 0) {
        return defaultTileUrls.map(url => {
            const { name, attr } = detailsForUrls.find(({ part }) => url.toLowerCase().includes(part));
            return { name, url, attr };
        })
    }
    const sortedUrlKeys = urlKeys.sort((a, b) => a.localeCompare(b));
    return sortedUrlKeys.map((urlkey, i) => {
        const url = process.env[urlkey];
        const attrkey = urlkey.replace(urlprefix, attrprefix);
        const detail = detailsForUrls.find(({ part }) => url.toLowerCase().includes(part));
        const name = detail ? detail.name : 'Map' + (i + 1);
        const attr = process.env[attrkey] || (detail ? detail.attr : '');
        return { name, url, attr };
    });
}
export const MapTileLayer = () => {
    // const urlKeys = Object.keys(process.env).filter(x => x.startsWith(urlprefix));
    // const sortedUrlKeys = urlKeys.sort((a, b) => a.localeCompare(b));
    // let mapTileUrls = sortedUrlKeys.map(urlkey => {
    //     const url = process.env[urlkey];
    //     const attrkey = urlkey.replace(urlprefix, attrprefix);
    //     const attr = attributionForTile(process.env[attrkey]);
    //     return { url, attr };
    // });
    // if (mapTileUrls.length === 0) {
    //     const defaultTileUrls = [
    //         'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga',
    //         'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png',
    //         'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    //     ];
    //     mapTileUrls = defaultTileUrls.map(url => {
    //         return { url, attr: attributionForTile(url) };
    //     });
    // }

    // console.log(process.env);
    // console.log(Object.keys(process.env));
    // const mapTileUrl = process.env.REACT_APP_MAP_URL || 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png';
    // const mapAttrib = attributionForTile(process.env.REACT_APP_MAP_ATTRIBUTION);
    // if (mapTileUrl.includes())
    //     if (!process.env.REACT_APP_MAP_ATTRIBUTION || !process.env.REACT_APP_MAP_URL) {
    //         console.log('Getting map tileserver url from hardcoded:', mapTileUrl);
    //     }

    return (
        <>
            {obtainTileUrls().map(({ name, url, attr }) =>
                <TileLayer
                    key={name}
                    attribution={attr}
                    url={url}
                />
            )}
        </>
    )
}