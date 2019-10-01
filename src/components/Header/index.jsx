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
    this.handleTabChange(event, 0); // 0 is the first tab (Trials)
    this.props.selectActiveExperiment('', ''); // reset selected experiment
  };

  selectExperiment = (id, name) => {
    const { selectActiveExperiment } = this.props;
    selectActiveExperiment(id, name);
    this.handleMenuClose();
  };

  handleExperimentMouseEnter = () => {
    this.setState({ isExperimentHovering: true });
  };

  handleExperimentMouseLeave = () => {
    this.setState({ isExperimentHovering: false });
  };

  renderCurrentExperimentName = (currentExperiment, isExperimentHovering) => {
    if (currentExperiment.name && currentExperiment.id && isExperimentHovering) {
      return (
        `${currentExperiment.name} (ID: ${currentExperiment.id})`
      );
    }

    if (currentExperiment.name && !isExperimentHovering) {
      return `${currentExperiment.name}`;
    }

    return 'Select an Experiment';
  };

  render() {
    const { classes, currentExperiment, experiments, tabValue } = this.props;
    const { anchorElement, isExperimentHovering } = this.state;

    return (
      <Grid container className={classes.root}>
        <Grid item container xs={4} alignItems="flex-start">
          <Link to="/" onClick={this.handleLogoClick} className={classes.logo}>
            Argos
          </Link>
          <Divider orientation="vertical" className={classnames(classes.divider, classes.leftDivider)} />
          <Button
            aria-controls="experiments-menu"
            aria-haspopup="true"
            onClick={this.handleMenuClick}
            disableRipple
            className={classnames(classes.expandButton, classes.expandExperimentButton)}
            onMouseEnter={this.handleExperimentMouseEnter}
            onMouseLeave={this.handleExperimentMouseLeave}
          >
            {this.renderCurrentExperimentName(currentExperiment, isExperimentHovering)}
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
                key={experiment.id}
                onClick={() => this.selectExperiment(experiment.id, experiment.name)
                }
              >
                {experiment.name}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
        <Grid item container xs={8} justify="flex-end">
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
          <Divider orientation="vertical" className={classnames(classes.divider, classes.rightDivider)} />
          <div className={classes.profileWrapper}>
            <Avatar alt="user avatar" className={classes.avatar} />
            <Button
              aria-controls="user-menu"
              aria-haspopup="true"
              // onClick={}
              disableRipple
              className={classnames(classes.expandButton, classes.expandProfileButton)}
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
