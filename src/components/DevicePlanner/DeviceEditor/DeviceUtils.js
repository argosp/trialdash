export const getTypeLocationProp = (deviceType) => {
    const locationProp = deviceType.properties.find(prop => prop.type === "location");
    if (!locationProp || !locationProp.key || locationProp.key === '') return undefined;
    return locationProp.key;
}

export const getDeviceLocation = (device, deviceType) => {
    const locationProp = getTypeLocationProp(deviceType);
    const pos = device.properties.find(pr => pr.key === locationProp);
    if (!pos || !pos.val || !pos.val.coordinates) return undefined;
    return pos.val.coordinates;
}

export const setDeviceLocation = (device, deviceType, newLocation) => {
    const locationProp = getTypeLocationProp(deviceType);
    const pos = device.properties.findIndex(pr => pr.key === locationProp);
    if (pos !== -1) {
        device.properties.splice(pos, 1);
    }
    device.properties.push({
        key: locationProp,
        val: { name: "OSMMap", coordinates: newLocation }
    });
}

