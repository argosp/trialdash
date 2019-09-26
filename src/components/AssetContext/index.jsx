import React from 'react';
import { Query, Subscription } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { styles } from './styles';

import assetsQuery from './utils/assetQuery';
import AssetForm from './AssetForm';
import ListOfAssets from './ListOfAssets';
import assetsSubscription from './utils/assetsSubscription';
// MATERIAL UI DEPENDENCIES

const TabContainer = props => (
  <Typography component="div" style={{ padding: 8 * 3 }}>
    {props.children}
  </Typography>
);

class AssetMainView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      collection: '',
      assets: [],
      query: true,
    };
  }

  componentWillMount() {
    // this.assetUpdatedSubscription()
  }

  componentDidMount() {
    console.log(this.state);
  }

  executeQuery = () => this.setState(prevState => ({ query: !prevState.query }));

  handleChangeTab = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    let queryRefecth = null;
    return (
      <div className={classes.root}>
        <Paper square>
          <Tabs
            value={value}
            onChange={this.handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label={`${this.props.entityType}s list`} />
            <Tab label="+" />
          </Tabs>
        </Paper>
        <Query
          query={assetsQuery(this.props.experimentId, this.props.entityType)}
        >
          {({ loading, error, data, refetch }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p> No {this.props.entityType}s to show</p>;
            queryRefecth = refetch;
            return (
              <div>
                {value === 0 && (
                  <TabContainer>
                    <ListOfAssets
                      assets={data.assets}
                      experimentId={this.props.experimentId}
                      entityType={this.props.entityType}
                    />
                  </TabContainer>
                )}
                {value === 1 && (
                  <TabContainer>
                    <AssetForm
                      experimentId={this.props.experimentId}
                      entityType={this.props.entityType}
                    />
                  </TabContainer>
                )}
              </div>
            );
          }}
        </Query>
        <Subscription subscription={assetsSubscription}>
          {({ data }) => {
            if (data && data.assetsUpdated) {
              if (queryRefecth !== null) queryRefecth();
            }
            return null;
          }}
        </Subscription>
      </div>
    );
  }
}

export default withStyles(styles)(AssetMainView);
