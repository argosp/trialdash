import { CircularProgress, withStyles } from '@material-ui/core';
import React from 'react';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import deviceTypesQuery from '../DeviceContext/utils/deviceTypeQuery';
import { DeviceEditor } from './DeviceEditor/DeviceEditor';
import { styles } from './styles';
import devicesQuery from './utils/devicesQuery';
import { getTypeLocationProp, getDeviceLocationProp, sortDevices, findDevicesChanged } from './DeviceEditor/DeviceUtils';
import devices from './utils/devicesQuery';

class DevicePlanner extends React.Component {
    state = {
        devices: []
    };

    componentDidMount() {
        this.getDevices()
    }

    getDevices = async () => {
        const { client, match } = this.props;
        const experimentId = match.params.id
        const newdevs = []
        client.query({ query: deviceTypesQuery(experimentId) })
            .then((dataType) => {
                const deviceTypes = dataType.data.deviceTypes.filter(devtype => getTypeLocationProp(devtype));
                console.log('deviceTypes: ', dataType, deviceTypes);
                deviceTypes.forEach(devtype => {
                    client.query({ query: devicesQuery(experimentId, devtype.key) })
                        .then(dataDev => {
                            console.log('devices: ', dataDev);
                            devtype.items = dataDev.data.devices;
                            newdevs.push(devtype);
                        })
                        .then(() => {
                            sortDevices(newdevs);
                            console.log('setDevices: ', newdevs);
                            this.setState(() => ({ devices: newdevs }));
                        })
                })
            })
    }

    render() {
        const { updateLocation } = this.props;
        const goodDevices = this.state.devices.filter(d => d.items && d.type);
        if (goodDevices.length === 0 || this.state.devices.length !== goodDevices.length) {
            return <CircularProgress style={{ marginLeft: '50%', marginTop: '40vh' }} />;
        } else {
            return (
                <DeviceEditor
                    devices={this.state.devices}
                    setDevices={(newDevices) => {
                        findDevicesChanged(this.state.devices, newDevices).forEach(changed => {
                            const { newDev, newDevType } = changed;
                            console.log('change', newDev);
                            const locationProp = getDeviceLocationProp(newDev, newDevType);
                            const changeProps = [{ key: locationProp.key, val: JSON.stringify(locationProp.val) }];
                            updateLocation({ key: newDev.key, type: "device", typeKey: newDevType.key, properties: changeProps });
                        });
                        this.setState(() => ({ devices: newDevices }));
                    }}
                >
                </DeviceEditor>
            );
        }
    }
}

export default compose(
    withRouter,
    withApollo,
    withStyles(styles),
)(DevicePlanner);
