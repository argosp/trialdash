import { CircularProgress, withStyles } from '@material-ui/core';
import React from 'react';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import deviceTypesQuery from '../DeviceContext/utils/deviceTypeQuery';
import { DeviceEditor } from './DeviceEditor';
import { styles } from './styles';
import devicesQuery from './utils/devicesQuery';

const positionKey = "85ad5104-a5af-4556-b9b0-699b3798996d";

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
        const devices = []
        client.query({ query: deviceTypesQuery(experimentId) })
            .then((data) => {
                console.log('types: ', data);
                data.data.deviceTypes.map(type => {
                    type.type = type.name;
                    devices.push(type);
                    const deviceTypeKey = type.key
                    client.query({ query: devicesQuery(experimentId, deviceTypeKey) })
                        .then(data => {
                            console.log('devices: ', data);
                            type.items = data.data.devices;
                            // type.items = JSON.parse(JSON.stringify(data.data.devices));
                            // type.items.forEach(d => {
                            //     const pos = d.properties.find(pr => pr.key === positionKey);
                            //     if (pos) {
                            //         d.position = pos.val;
                            //     }
                            // })
                        })
                        .then(() => {
                            this.setState(() => ({ devices }))
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
                                                    key: positionKey,
                                                    val: JSON.stringify(newDev.position)
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
        //     return (
        //       <div>
        //         {this.state.devices.length > 0 &&
        //           this.state.devices.map(devicesByType => {
        //             return devicesByType.map(device => (
        //               <p>
        //                 <span>id: {device.id}</span> <br/>
        //                 <span>name: {device.name}</span> <br/>
        //                 <span>deviceTypeKey: {device.deviceTypeKey}</span> <br/>
        //                 <span>key: {device.key}</span> <br/>
        //                 <span>properties: { device.properties.map( prop => (<span>key:{prop.key}, value: {prop.value},</span>))}</span> <br/>
        //               </p>)
        //             )
        //           })
        //         }
        //       </div>
        //     );
    }
}

export default compose(
    withRouter,
    withApollo,
    withStyles(styles),
)(DevicePlanner);
