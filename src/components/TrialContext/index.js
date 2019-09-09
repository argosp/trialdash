import React from "react";
import PropTypes from "prop-types";
import { Query, Subscription } from "react-apollo";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";
import { styles } from "./styles";

import trialsQuery from "./utils/trialQuery";
import ListOfTrials from "./ListOfTrials";
import trialsSubscription from "./utils/trialsSubscription";
//MATERIAL UI DEPENDENCIES

class TrialMainView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      collection: "",
      arrayOfTrials: [],
      experimentId: "",
      query: true
    };
  }
  componentWillMount() {
    //this.trialUpdatedSubscription()
  }
  componentDidMount() {
    console.log(this.state);
  }
  executeQuery = () =>
    this.setState(prevState => ({ query: !prevState.query }));

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    let queryRefetch = null;
    return (
      <div>
        <Grid container justify="space-between" className={classes.header}>
          <h1 className={classes.title}>Trials</h1>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search Trials"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ "aria-label": "search" }}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.searchButton}
            >
              Add trial
            </Button>
          </div>
        </Grid>
        <Query query={trialsQuery(this.props.experimentId)}>
          {({ loading, error, data, refetch }) => {
            let loadingTxt = this.state.value === 0 ? "loading..." : "";
            if (loading)
              return <p style={{ textAlign: "left" }}>{loadingTxt}</p>;
            if (error) {
              if (this.state.value === 0)
                return <p style={{ textAlign: "left" }}> No trials to show</p>;
              return <p />;
            }
            queryRefetch = refetch;
            return (
              <div>
                {value === 0 && (
                  <ListOfTrials
                    experimentId={this.props.experimentId}
                    trials={data.trials}
                    devices={data.devices}
                  />
                )}
              </div>
            );
          }}
        </Query>
        <Subscription subscription={trialsSubscription}>
          {({ data, loading }) => {
            if (data && data.trialsUpdated)
              queryRefetch !== null && queryRefetch();
            return null;
          }}
        </Subscription>
        {/* <Query
          query={devicesQuery(this.props.experimentId, 'device')}
        >
          {
            ({ loading, error, data, refetch }) => {
              if (this.state.value === 1 && (this.props.experimentId == null || this.props.experimentId === ''))
                return <p style={{color: 'red', 'textAlign': 'left'}}>Please select an experiment first</p>;
              if (loading) return <p></p>;
              if (error) return;
              return (
                <div>
                  {value === 1 &&
                    <TabContainer>
                      { this.props.experimentId != null && this.props.experimentId !== '' ?
                      <TrialForm
                        experimentId={this.props.experimentId}
                        devices={data.devices}
                        showAll={() => this.setState({ value: 1 })}
                        /> : null }
                    </TabContainer>}

                </div>
              )
            }
          }
        </Query> */}
      </div>
    );
  }
}

TrialMainView.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TrialMainView);
