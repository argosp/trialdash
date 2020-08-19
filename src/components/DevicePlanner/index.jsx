import { CircularProgress, withStyles } from '@material-ui/core';
import React from 'react';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { DeviceEditor } from './DeviceEditor';
import { styles } from './styles';
import { getTypeLocationProp, getDeviceLocationProp, changeDeviceLocationWithProp, sortDevices, findDevicesChanged } from './DeviceUtils';
import deviceTypesQuery from '../DeviceContext/utils/deviceTypeQuery';
import devicesTrialQuery from './utils/devicesTrialQuery';

const DevicePlanner = ({ client, trial, match, updateLocation }) => {
    const [devices, setDevices] = React.useState([]);

    React.useEffect(() => {
        const experimentId = match.params.id;
        const newdevs = [];
        client.query({ query: deviceTypesQuery(experimentId) })
            .then((dataType) => {
                const deviceTypes = dataType.data.deviceTypes.filter(devtype => devtype.name && getTypeLocationProp(devtype));
                deviceTypes.forEach(devtype => {
                    const locationProp = getTypeLocationProp(devtype);
                    client.query({ query: devicesTrialQuery(experimentId, devtype.key, undefined) })
                        .then(dataDev => {
                            devtype.items = dataDev.data.devices;
                            devtype.items.forEach(devitem => {
                                const devent = trial.entities.find(ent => ent.key === devitem.key);
                                if (devent) {
                                    const locprop = devent.properties.find(entprop => entprop.key === locationProp);
                                    if (locprop) {
                                        try {
                                            const locparsed = JSON.parse(locprop.val);
                                            changeDeviceLocationWithProp(devitem, locationProp, locparsed.coordinates);
                                        } catch (e) {
                                        }
                                    }
                                }
                            });
                            newdevs.push(devtype);
                            if (newdevs.length === deviceTypes.length) {
                                sortDevices(newdevs);
                                setDevices(newdevs);
                            }
                        })
                })
            })
    }, []);

    return (
        devices.length === 0 ?
            <CircularProgress style={{ marginLeft: '50%', marginTop: '40vh' }} /> :
            <DeviceEditor
                devices={devices}
                setDevices={(newDevices) => {
                    const changedDevices = findDevicesChanged(devices, newDevices);
                    const changedDetails = changedDevices.map(changed => {
                        const { dev: newDev, type: newDevType } = changed;
                        const locationProp = getDeviceLocationProp(newDev, newDevType);
                        const changeProps = [{ key: locationProp.key, val: JSON.stringify(locationProp.val) }];
                        return { key: newDev.key, type: "device", typeKey: newDevType.key, properties: changeProps };
                    });

                    // Calling updateLocation one change at a time, otherwise it crushes.
                    const uploc = () => {
                        if (changedDetails.length) {
                            const ch = changedDetails.pop();
                            console.log('change', ch);
                            updateLocation(ch)
                                .then(uploc);
                        }
                    }
                    uploc();
                    setDevices(newDevices);
                }}
            />
    );
}

export default compose(
    withRouter,
    withApollo,
    withStyles(styles),
)(DevicePlanner);
