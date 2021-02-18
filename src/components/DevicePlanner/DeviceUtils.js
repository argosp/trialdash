export const getTypeLocationProp = (deviceType) => {
    const locationProp = deviceType.properties.find(prop => prop.type === "location");
    if (!locationProp || !locationProp.key || locationProp.key === '') return undefined;
    return locationProp.key;
}

export const getDeviceLocationProp = (device, deviceType) => {
    const key = getTypeLocationProp(deviceType);
    const prop = device.properties.find(pr => pr.key === key);
    if (!prop || !prop.val) return undefined;
    return prop;
}

export const getDeviceLocation = (device, deviceType, locationKind) => {
    const prop = getDeviceLocationProp(device, deviceType);
    if (prop && prop.val && prop.val.name === locationKind) {
        return prop.val.coordinates;
    }
    return undefined;
}

export const changeDeviceLocation = (device, deviceType, newLocation, locationKind) => {
    const locationPropKey = getTypeLocationProp(deviceType);
    changeDeviceLocationWithProp(device, locationPropKey, newLocation, locationKind);
}

export const changeDeviceLocationWithProp = (device, locationPropKey, newLocation, locationKind) => {
    const pos = device.properties.findIndex(pr => pr.key === locationPropKey);
    if (pos !== -1) {
        device.properties.splice(pos, 1);
    }
    device.properties.push({
        key: locationPropKey,
        val: { name: locationKind, coordinates: newLocation }
    });
}

export const sortDevices = (deviceTypes) => {
    deviceTypes.sort((a, b) => (a.name + ";" + a.key).localeCompare(b.name + ";" + b.key));
    deviceTypes.forEach(devType => {
        devType.items.sort((a, b) => (a.name + ";" + a.key).localeCompare(b.name + ";" + b.key));
    });
    return deviceTypes;
}

export const findDevicesChanged = (oldDeviceTypes, newDeviceTypes) => {
    let ret = [];
    newDeviceTypes.forEach(newDevType => {
        const oldDevType = oldDeviceTypes.find(ty => ty.key === newDevType.key);
        if (oldDevType && oldDevType.items && newDevType.items) {
            newDevType.items.forEach(newDev => {
                const oldDev = oldDevType.items.find(d => d.key === newDev.key);
                if (oldDev && JSON.stringify(oldDev) !== JSON.stringify(newDev)) {
                    ret.push({ dev: newDev, type: newDevType });
                }
            })
        }
    });
    return ret;
}