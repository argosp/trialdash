import React from 'react';
import { withStyles } from '@material-ui/core';

import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { styles } from './styles';
import config from '../../config';
import { updateCache } from '../../apolloGraphql';
import deviceTypesQuery from '../DeviceContext/utils/deviceTypeQuery';
import devicesQuery from './utils/devicesQuery';
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
          const deviceTypeKey = type.key
          client.query({ query: devicesQuery(experimentId, deviceTypeKey) })
            .then(data => {
              console.log('devices: ', data);
              devices.push(data.data.devices)
            })
            .then(() => {
              this.setState(() => ({ devices }))
            })
        })
      })
  }


  render() {
    return (
      <DeviceEditor
        devices={this.state.devices}
        setDevices={(newDevices) => {
          console.log(newDevices);
        }}
      >
      </DeviceEditor>
    );
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
