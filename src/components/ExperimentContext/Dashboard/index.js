import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { styles } from './styles';
import Graph from '../../../apolloGraphql';
import MainView from '../MainView';
import config from '../../../config';

//MATERIAL UI DEPENDENCIES
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExploreIcon from '@material-ui/icons/Explore';
import Button from '@material-ui/core/Button';
import experimentsQuery from '../utils/experiments-query';
import ExperimentForm from '../ExperimentForm';
import { Subscription } from 'react-apollo';
import experimentsSubscription from '../utils/experimentsSubscription';

const graphql = new Graph();

class ListOfExperiments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      experiments: [],
      render: false,
      timeout: false,
      currentExperiment: { name: "", id: "" }
    };
  }

  componentDidMount() {
    graphql.sendQuery(experimentsQuery)
      .then(data => {
        this.setState(() => ({
          experiments: data.experiments,
          render: true
        }));
      })
      .then(() => {
        setTimeout(() => {
          this.setState(() => ({ timeout: true }))
        }, 5000)
      })
  }

  componentDidUpdate() {
    if (this.state.experiments && this.state.experiments.length > 0 && this.state.render === false) {
      this.setState(() => ({ render: true }))
    }
  }
  handleDrawerOpen = () => {
    this.setState({ open: true });
  };
  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  selectActiveExperiment = (id, name) => {
    const currentExperiment = { name, id }
    this.setState(() => ({ currentExperiment }))
  }

  logout = () => {
    localStorage.clear();
    this.props.history.push('/login');
  }

  render() {
    const { classes, theme } = this.props;
    const { open } = this.state;
    if (this.state.render)
      return (
        <div className={classes.root}>
          {this.state.add && <ExperimentForm close={() => {this.setState({ add: false })}}/>}
          <CssBaseline />
          <AppBar
            position="fixed"
            className={classNames(classes.appBar, {
              [classes.appBarShift]: true,
            })}
          >
            <Toolbar disableGutters={!open}>
              <Typography variant="h6" color="inherit" noWrap>
                CURRENT EXPERIMENT: {this.state.currentExperiment.name} (<span className={classes.subtitle}>ID: {this.state.currentExperiment.id}</span>)
            </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={true}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={this.logout}
              >
                Logout
            </Button>
            </div>
            <Divider />
            <List>
              {this.state.experiments.map((experiment, index) => (
                <ListItem
                  button
                  key={experiment.id}
                  id={experiment.id}
                  onClick={() => this.selectActiveExperiment(experiment.id, experiment.name)}
                >
                  <ListItemIcon><ExploreIcon /></ListItemIcon>
                  <ListItemText
                    primary={experiment.name} />
                </ListItem>
              ))}
            </List>
            <div onClick={() => this.setState({ add: true })} style={{cursor: 'pointer'}}> + Add An Experiment</div>
            <Divider />
            <div className="footer"
            //style={{'background-color':'#dddddd'}}
            >
            <a href={`${config.url}/graphql`} target="_blank">GraphQL Playground</a>
          </div>
          </Drawer>
          <main
            className={classNames(classes.content, {
              [classes.contentShift]: true,
            })}>
            <div className={classes.drawerHeader} />
            <MainView id={this.state.currentExperiment.id} />
          </main>
          {/* <Subscription
            subscription={experimentsSubscription}>
            {({ data, loading }) => {
              if (data && data.experimentsUpdated)
                this.queryRefecth !== null && this.queryRefecth();
              return null
            }}
          </Subscription> */}
        </div>
      );
    else return this.state.timeout ?
      (<p>Something went wrong... </p>)
      :
      (<p>Please wait... </p>)
  }
}

ListOfExperiments.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ListOfExperiments);
