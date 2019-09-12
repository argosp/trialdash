import React from 'react';
import { Query, Subscription } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import devicesQuery from './utils/deviceQuery';
import DeviceForm from './DeviceForm';
import ListOfDevices from './ListOfDevices';
import devicesSubscription from './utils/devicesSubscription';

class DeviceMainView extends React.PureComponent {
  render() {
    const { classes } = this.props;
    let queryRefetch = null;

    return (
      <div className={classes.root}>
        <Query
          query={devicesQuery(this.props.experimentId, this.props.entityType)}
        >
          {({ loading, error, data, refetch }) => {
            if (loading) return <p>Loading...</p>;
            if (error) {
              return <p> No {this.props.entityType}s to show</p>;
            }
            queryRefetch = refetch;
            return (
              <div>
                <ListOfDevices
                  devices={data.devices}
                  experimentId={this.props.experimentId}
                  entityType={this.props.entityType}
                />
                <DeviceForm
                  experimentId={this.props.experimentId}
                  entityType={this.props.entityType}
                />
              </div>
            );
          }}
        </Query>
        <Subscription subscription={devicesSubscription}>
          {({ data, loading }) => {
            if (data && data.devicesUpdated) {
              queryRefetch !== null && queryRefetch();
            }
            return null;
          }}
        </Subscription>
      </div>
    );
  }
}

export default withStyles(styles)(DeviceMainView);
