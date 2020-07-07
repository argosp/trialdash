import { CircularProgress, withStyles } from '@material-ui/core';
import React from 'react';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import deviceTypesQuery from '../DeviceContext/utils/deviceTypeQuery';
import DeviceEditor from './DeviceEditor/DeviceEditor';
import { styles } from './styles';
import devicesQuery from './utils/devicesQuery';
import { getTypeLocationProp, getDeviceLocation } from './DeviceEditor/DeviceUtils';

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
                            devtype.type = devtype.name;
                            devtype.items = JSON.parse(JSON.stringify(dataDev.data.devices));
                            newdevs.push(devtype);
                        })
                        .then(() => {
                            console.log('setDevices: ', newdevs);
                            this.setState(() => ({ devices: newdevs }))
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
                        newDevices.forEach(newDevType => {
                            const oldDevType = this.state.devices.find(ty => ty.type === newDevType.type);
                            if (oldDevType && oldDevType.items && newDevType.items) {
                                newDevType.items.forEach(newDev => {
                                    const oldDev = oldDevType.items.find(d => d.key === newDev.key);
                                    if (oldDev && JSON.stringify(oldDev) !== JSON.stringify(newDev)) {
                                        console.log('change', newDev);
                                        updateLocation({
                                            key: newDev.key,
                                            type: "device",
                                            typeKey: newDevType.key,
                                            properties: [
                                                {
                                                    key: getTypeLocationProp(newDevType),
                                                    val: JSON.stringify({ name: "OSMMap", coordinates: getDeviceLocation(newDev, newDevType) })
                                                }
                                            ]
                                        })
                                    }
                                })
                            }
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
