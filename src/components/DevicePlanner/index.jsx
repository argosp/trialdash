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
class DevicePlanner extends React.Component {
  state = {
    devices:[]
  };
  componentDidMount(){
    this.getDevices()
  }
  getDevices = async () => {
    const { client, match } = this.props;
    const experimentId = match.params.id
    const devices = []
    client.query({ query: deviceTypesQuery(experimentId) })
      .then((data) => {
        data.data.deviceTypes.map( type => {
          const deviceTypeKey = type.key
          client.query({ query: devicesQuery(experimentId, deviceTypeKey)})
          .then(data => {
            devices.push(data.data.devices)
          })
          .then( () => {
            this.setState(() => ({devices}))
          })
        })
      })
  }


  render() {
    return (
      <div>
        { this.state.devices.length > 0 &&
          this.state.devices.map( devicesByType => {
            return devicesByType.map(device => (<p>id: {device.id} name: {device.name}</p>)
            )
          })
        }
      </div>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles),
)(DevicePlanner);
