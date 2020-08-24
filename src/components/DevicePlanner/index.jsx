import { LinearProgress, withStyles } from '@material-ui/core';
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
    const [showOnlyAssigned, setShowOnlyAssigned] = React.useState(false);
    const [working, setWorking] = React.useState(false);

    const deviceWithTrialLocation = (devitem, locationPropOnDevType) => {
        const deviceEntityOnTrial = trial.entities.find(ent => ent.key === devitem.key);
        if (deviceEntityOnTrial) {
            const locationOnTrial = deviceEntityOnTrial.properties.find(entprop => entprop.key === locationPropOnDevType);
            if (locationOnTrial) {
                try {
                    const locparsed = JSON.parse(locationOnTrial.val);
                    changeDeviceLocationWithProp(devitem, locationPropOnDevType, locparsed.coordinates);
                } catch (e) {
                }
            }
        }
        return devitem;
    };

    React.useEffect(() => {
        const experimentId = match.params.id;
        const newdevs = [];
        const trialKey = showOnlyAssigned ? trial.key : undefined;
        setWorking(true);
        client.query({ query: deviceTypesQuery(experimentId) })
            .then((dataType) => {
                setWorking(25);
                const deviceTypes = dataType.data.deviceTypes.filter(devtype => devtype.name && getTypeLocationProp(devtype));
                deviceTypes.forEach(devtype => {
                    const locationProp = getTypeLocationProp(devtype);
                    client.query({ query: devicesTrialQuery(experimentId, devtype.key, trialKey) })
                        .then(dataDev => {
                            setWorking(25 + newdevs.length / deviceTypes.length * 75);
                            devtype.items = dataDev.data.devices.map(devitem => deviceWithTrialLocation(devitem, locationProp));
                            newdevs.push(devtype);
                            if (newdevs.length === deviceTypes.length) {
                                sortDevices(newdevs);
                                setWorking(100);
                                setDevices(newdevs);
                                setTimeout(() => setWorking(false), 500);
                            }
                        })
                })
            })
    }, [showOnlyAssigned]);

    return (
        <>
            {
                (devices.length === 0 || working) &&
                (working === !!working ?
                    <LinearProgress /> :
                    <LinearProgress variant="determinate" value={working} />)
            }
            {
                (devices.length > 0) &&
                <DeviceEditor
                    devices={devices}
                    setDevices={(newDevices) => {
                        setWorking(true);
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
                                setWorking((1 - changedDetails.length / changedDevices.length) * 100);
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
                        setDevices(newDevices);
                    }}
                    showOnlyAssigned={showOnlyAssigned}
                    setShowOnlyAssigned={setShowOnlyAssigned}
                />
            }
        </>
    );
}

export default compose(
    withRouter,
    withApollo,
    withStyles(styles),
)(DevicePlanner);
