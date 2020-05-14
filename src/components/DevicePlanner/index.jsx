import React from 'react';
import { withStyles, CircularProgress } from '@material-ui/core';

import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { styles } from './styles';
import config from '../../config';
import { updateCache } from '../../apolloGraphql';
import deviceTypesQuery from '../DeviceContext/utils/deviceTypeQuery';
import devicesQuery from './utils/devicesQuery';
import deviceMutation from '../DeviceContext/DeviceForm/utils/deviceMutation';
import { DeviceEditor } from './DeviceEditor';
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
            })
            .then(() => {
              this.setState(() => ({ devices }))
            })
        })
      })
  }


  render() {
    const { devices } = this.props;

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
