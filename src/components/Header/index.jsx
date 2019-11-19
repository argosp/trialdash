import React from 'react';
import { Link, withRouter, matchPath } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import classnames from 'classnames';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import Box from '@material-ui/core/Box';
import uuid from 'uuid/v4';
import { compose } from 'recompose';
import { isEmpty } from 'lodash';
import gql from 'graphql-tag';
import { Query, withApollo } from 'react-apollo';
import { styles } from './styles';
import StyledTabs from '../StyledTabs';
import experimentsQuery from '../ExperimentContext/utils/experimentsQuery';
import { TRIAL_SETS_DASH } from '../../constants/base';
import { TABS } from '../../constants/routes';

const UserData = ({ classes, handleProfileMenuClick }) => (
  <Query
    query={gql` {
          user(uid:"${localStorage.getItem('uid')}") {
              email
              name
              username
              avatar
          }
        }
        `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p> No data to show</p>;
      return (
        <>
          <Avatar
            src={data.user.avatar}
            alt="user avatar"
            className={classes.avatar}
          />
          <Button
            aria-controls="user-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuClick}
            disableRipple
            className={classnames(
              classes.expandButton,
              classes.expandProfileButton,
            )}
          >
            {data.user.name}
            <ExpandMoreIcon />
          </Button>
        </>
      );
    }}
  </Query>
);

class Header extends React.Component {
  state = {
    anchorExperimentsMenu: null,
    anchorProfileMenu: null,
    isExperimentHovering: false,
    isLoading: true,
  };

  componentDidMount() {
    const { client, location } = this.props;

    Object.keys(TABS).forEach((tab) => {
      if (location.pathname.includes(TABS[tab])) {
        client.writeData({ data: { headerTabId: +tab } });
      }
    });

    client
      .query({ query: experimentsQuery })
      .then(() => this.setState({ isLoading: false }));
  }

  handleProfileMenuClick = (event) => {
    this.setState({
      anchorProfileMenu: event.currentTarget,
    });
  };

  handleExperimentsMenuClick = (event) => {
    this.setState({
      anchorExperimentsMenu: event.currentTarget,
      isExperimentHovering: false,
    });
  };

  handleMenuClose = (anchor) => {
    this.setState({ [anchor]: null });
  };

  handleTabChange = (event, tabId, experimentId) => {
    const { client, history } = this.props;

    client.writeData({ data: { headerTabId: tabId } });
    history.push(`/experiments/${experimentId}/${TABS[tabId]}`);
  };

  selectExperiment = (experimentId) => {
    const { history, client } = this.props;
    history.push(`/experiments/${experimentId}/${TRIAL_SETS_DASH}`);
    client.writeData({ data: { headerTabId: 0 } }); // 0 is the Trials tab
    this.handleMenuClose('anchorExperimentsMenu');
  };

  handleExperimentMouseEnter = () => {
    this.setState({ isExperimentHovering: true });
  };

  handleExperimentMouseLeave = () => {
    this.setState({ isExperimentHovering: false });
  };

  renderCurrentExperimentName = (currentExperiment) => {
    const { isExperimentHovering } = this.state;

    if (
      currentExperiment.project.name
      && currentExperiment.project.id
      && isExperimentHovering
    ) {
      return `${currentExperiment.project.name} (ID: ${currentExperiment.project.id})`;
    }

    if (currentExperiment.project.name && !isExperimentHovering) {
      return `${currentExperiment.project.name}`;
    }

    return 'Select an Experiment';
  };

  logout = () => {
    localStorage.clear();
    this.props.history.push('/login');
  };

  render() {
    const { classes, client, location } = this.props;
    const { anchorExperimentsMenu, anchorProfileMenu, isLoading } = this.state;
    const pathObj = matchPath(location.pathname, {
      path: '/experiments/:id',
    });
    // "Edit experiment" page is without experiments dropdown and tabs also
    const withExperiments = Boolean(pathObj) && !location.pathname.includes('edit-experiment');
    const experiments = !isLoading
      ? client.readQuery({ query: experimentsQuery }).experimentsWithData
      : [];
    const currentExperiment = withExperiments
      ? experiments.find(
        experiment => experiment.project.id === pathObj.params.id,
      )
      : {};

    return (
      <Grid
        container
        className={
          withExperiments
            ? classes.root
            : classnames(classes.root, classes.rootWithoutExperiments)
        }
      >
        <Grid item container xs={5} alignItems="flex-start">
          <Box
            display="flex"
            alignItems="center"
            className={classes.logoWrapper}
          >
            <MenuIcon className={classes.menuIcon} />
            <Link to="/" className={classes.logo}>
              Argos
            </Link>
          </Box>
          <Divider
            orientation="vertical"
            className={classnames(classes.divider, classes.leftDivider)}
          />
          {withExperiments ? (
            <>
              <Button
                aria-controls="experiments-menu"
                aria-haspopup="true"
                onClick={this.handleExperimentsMenuClick}
                disableRipple
                className={classnames(
                  classes.expandButton,
                  classes.expandExperimentButton,
                )}
                onMouseEnter={this.handleExperimentMouseEnter}
                onMouseLeave={this.handleExperimentMouseLeave}
              >
                {!isEmpty(currentExperiment)
                  && this.renderCurrentExperimentName(currentExperiment)}
                <ExpandMoreIcon />
              </Button>
              <Menu
                id="experiments-menu"
                open={Boolean(anchorExperimentsMenu)}
                onClose={() => this.handleMenuClose('anchorExperimentsMenu')}
                anchorEl={anchorExperimentsMenu}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                {!isEmpty(experiments)
                  && experiments.map(experiment => (
                    <MenuItem
                      key={experiment.project.id}
                      onClick={() => this.selectExperiment(experiment.project.id)
                      }
                    >
                      {experiment.project.name}
                    </MenuItem>
                  ))}
              </Menu>
            </>
          ) : null}
        </Grid>
        <Grid item container xs={7} justify="flex-end">
          {withExperiments ? (
            <>
              <Query
                query={gql`
                  {
                    headerTabId @client
                  }
                `}
              >
                {({ data }) => (
                  <StyledTabs
                    tabs={[
                      { key: uuid(), label: 'Trials', id: 'header-tab-0' },
                      { key: uuid(), label: 'Assets', id: 'header-tab-1' },
                      { key: uuid(), label: 'Devices', id: 'header-tab-2' },
                    ]}
                    value={data.headerTabId}
                    onChange={
                      (event, tabId) => this.handleTabChange(event, tabId, pathObj.params.id)
                    }
                    ariaLabel="header tabs"
                  />
                )}
              </Query>
              <Divider
                orientation="vertical"
                className={classnames(classes.divider, classes.rightDivider)}
              />
            </>
          ) : null}
          <div className={classes.profileWrapper}>
            <UserData
              classes={classes}
              handleProfileMenuClick={this.handleProfileMenuClick}
            />
            <Menu
              id="profile-menu"
              open={Boolean(anchorProfileMenu)}
              onClose={() => this.handleMenuClose('anchorProfileMenu')}
              anchorEl={anchorProfileMenu}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={() => this.logout()}>Log out</MenuItem>
            </Menu>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  withRouter,
  withApollo,
  withStyles(styles),
)(Header);
