import React, { useState } from 'react';
import { Link, withRouter, matchPath } from 'react-router-dom';
import { withStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import classnames from 'classnames';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
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
import { UserData } from './UserData';
import { UserDataMenu } from './UserDataMenu';

class Header extends React.Component {
  state = {
    anchorExperimentsMenu: null,
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
      currentExperiment.name
      && currentExperiment.project.id
      && isExperimentHovering
    ) {
      return `${currentExperiment.name} (ID: ${currentExperiment.project.id})`;
    }

    if (currentExperiment.name && !isExperimentHovering) {
      return `${currentExperiment.name}`;
    }

    return 'Select an Experiment';
  };

  render() {
    const { classes, client } = this.props;
    const { anchorExperimentsMenu, isLoading } = this.state;
    const pathObj = matchPath(this.props.location.pathname, {
      path: '/experiments/:id',
      exact: false,
      strict: false,
    });
    const withExperiments = Boolean(pathObj);
    const experiments = !isLoading
      ? client.readQuery({ query: experimentsQuery }).experimentsWithData
      : [];
    const currentExperiment = withExperiments && experiments ? experiments.find(
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
              {!isEmpty(experiments)
                && (
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
                          {experiment.name}
                        </MenuItem>
                      ))}
                  </Menu>
                )}
            </>
          ) : null}
        </Grid>
        <Grid item container xs={7} justifyContent="flex-end">
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
                      { key: uuid(), label: 'Entities', id: 'header-tab-1' },
                      { key: uuid(), label: 'Logs', id: 'header-tab-2' },
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
          <UserDataMenu
            classes={classes}
            history={this.props.history}
          />
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
