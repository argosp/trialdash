import { LinearProgress, withStyles } from '@material-ui/core';
import React from 'react';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import deviceTypesQuery from '../DeviceContext/utils/deviceTypeQuery';
import { DeviceEditor } from './DeviceEditor';
import { changeDeviceLocationWithProp, findDevicesChanged, getDeviceLocationProp, getTypeLocationProp } from './DeviceUtils';
import { styles } from './styles';
import devicesTrialQuery from './utils/devicesTrialQuery';

const DevicePlanner = ({ client, trial, match, updateLocation }) => {
    const [showOnlyAssigned, setShowOnlyAssigned] = React.useState(false);
    const [devices, setDevices] = React.useState([]);
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
        const trialKey = showOnlyAssigned ? trial.key : undefined;
        setWorking(true);
        client.query({ query: deviceTypesQuery(experimentId) })
            .then((dataType) => {
                setWorking(25);
                const newdevs = dataType.data.deviceTypes.filter(devtype => devtype.name && getTypeLocationProp(devtype));
                newdevs.forEach(d => d.items = []);
                newdevs.sort((a, b) => (a.name + ";" + a.key).localeCompare(b.name + ";" + b.key));
                // setDevices(newdevs);
                let done = 0;
                newdevs.forEach(devtype => {
                    const locationProp = getTypeLocationProp(devtype);
                    client.query({ query: devicesTrialQuery(experimentId, devtype.key, trialKey) })
                        .then(dataDev => {
                            done += 1
                            setWorking(25 + done / newdevs.length * 75);
                            devtype.items = dataDev.data.devices.map(devitem => deviceWithTrialLocation(devitem, locationProp));
                            devtype.items.sort((a, b) => (a.name + ";" + a.key).localeCompare(b.name + ";" + b.key));
                            if (done === newdevs.length) {
                                setDevices(newdevs);
                            }
                            setTimeout(() => setWorking(false), 500);
                        })
                })
            })
    }, [showOnlyAssigned]);

    const handleChangeDevices = (newDevices) => {
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
    };

    return (
        <>
            {
                (devices.length === 0 || working) &&
                (working === !!working ?
                    <LinearProgress /> :
                    <LinearProgress variant="determinate" value={working} />)
            }
            {
                <DeviceEditor
                    devices={devices}
                    setDevices={handleChangeDevices}
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
