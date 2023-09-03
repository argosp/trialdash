import React from 'react';
import { Query, Subscription } from 'react-apollo';
import { withStyles } from '@mui/styles';
import { styles } from './styles';
import dataQuery from './utils/dataQuery';
import DataForm from './DataForm';
import dataSubscription from './utils/dataSubscription';

const DataMainView = (props) => {
  let queryRefecth = null;
  return (
    <div className={props.classes.root}>
      <Query query={dataQuery(props.experimentId)}>
        {({ loading, error, data, refetch }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p> No data to show</p>;
          queryRefecth = refetch;
          return (
            <div>
              <DataForm
                experimentId={props.experimentId}
                {...data.experimentData}
              />
            </div>
          );
        }}
      </Query>
      <Subscription subscription={dataSubscription}>
        {({ data }) => {
          if (data && data.experimentDataUpdated) {
            if (queryRefecth !== null) queryRefecth();
          }
          return null;
        }}
      </Subscription>
    </div>
  );
};

export default withStyles(styles)(DataMainView);
