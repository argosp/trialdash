import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import classnames from 'classnames';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import Box from '@material-ui/core/Box';
import { styles, tabsStyles } from './styles';

const StyledTabs = withStyles(tabsStyles)(props => (
  <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />
));

class Header extends React.Component {
  state = {
    anchorElement: null,
    isExperimentHovering: false,
  };

  handleMenuClick = (event) => {
    this.setState({
      anchorElement: event.currentTarget,
      isExperimentHovering: false,
    });
  };

  handleMenuClose = () => {
    this.setState({ anchorElement: null });
  };

  handleTabChange = (event, newValue) => {
    this.props.handleTabChange(newValue);
  };

  handleLogoClick = (event) => {
    this.handleTabChange(event, 3); // 3 is the Experiments
    this.props.selectActiveExperiment({}); // reset selected experiment
  };

  selectExperiment = (experiment) => {
    const { selectActiveExperiment } = this.props;
    selectActiveExperiment(experiment);
    this.handleMenuClose();
  };

  handleExperimentMouseEnter = () => {
    this.setState({ isExperimentHovering: true });
  };

  handleExperimentMouseLeave = () => {
    this.setState({ isExperimentHovering: false });
  };

  renderCurrentExperimentName = (currentExperiment, isExperimentHovering) => {
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

  render() {
    const {
      classes,
      currentExperiment,
      experiments,
      tabValue,
      withExperiments,
    } = this.props;
    const { anchorElement, isExperimentHovering } = this.state;

    return (
      <Grid
        container
        className={
          withExperiments
            ? classes.root
            : classnames(classes.root, classes.rootWithoutExperiments)
        }
      >
        <Grid item container xs={4} alignItems="flex-start">
          <Box
            display="flex"
            alignItems="center"
            className={classes.logoWrapper}
          >
            <MenuIcon className={classes.menuIcon} />
            <Link
              to="/"
              onClick={this.handleLogoClick}
              className={classes.logo}
            >
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
                onClick={this.handleMenuClick}
                disableRipple
                className={classnames(
                  classes.expandButton,
                  classes.expandExperimentButton,
                )}
                onMouseEnter={this.handleExperimentMouseEnter}
                onMouseLeave={this.handleExperimentMouseLeave}
              >
                {this.renderCurrentExperimentName(
                  currentExperiment,
                  isExperimentHovering,
                )}
                <ExpandMoreIcon />
              </Button>
              <Menu
                id="experiments-menu"
                open={Boolean(anchorElement)}
                onClose={this.handleMenuClose}
                anchorEl={anchorElement}
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
                {experiments.map(experiment => (
                  <MenuItem
                    key={experiment.project.id}
                    onClick={() => this.selectExperiment(experiment)}
                  >
                    {experiment.project.name}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : null}
        </Grid>
        <Grid item container xs={8} justify="flex-end">
          {withExperiments ? (
            <>
              <StyledTabs
                value={tabValue}
                onChange={this.handleTabChange}
                aria-label="header tabs"
              >
                <Tab
                  disableRipple
                  label="Trials"
                  id="header-tab-0"
                  className={classes.tab}
                />
                <Tab
                  disableRipple
                  label="Assets"
                  id="header-tab-1"
                  className={classes.tab}
                />
                <Tab
                  disableRipple
                  label="Devices"
                  id="header-tab-2"
                  className={classes.tab}
                />
              </StyledTabs>
              <Divider
                orientation="vertical"
                className={classnames(classes.divider, classes.rightDivider)}
              />
            </>
          ) : null}
          <div className={classes.profileWrapper}>
            <Avatar alt="user avatar" className={classes.avatar} />
            <Button
              aria-controls="user-menu"
              aria-haspopup="true"
              // onClick={}
              disableRipple
              className={classnames(
                classes.expandButton,
                classes.expandProfileButton,
              )}
            >
              Name Surname
              <ExpandMoreIcon />
            </Button>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Header);
