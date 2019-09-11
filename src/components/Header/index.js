import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { styles, tabsStyles } from './styles';

const StyledTabs = withStyles(tabsStyles)(props => (
  <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />
));

class Header extends React.Component {
  state = {
    anchorElement: null,
    tabValue: 0,
  };

  handleMenuClick = (event) => {
    this.setState({
      anchorElement: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({ anchorElement: null });
  };

  handleTabChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  selectExperiment = (id, name) => {
    const { selectActiveExperiment } = this.props;
    selectActiveExperiment(id, name);
    this.handleMenuClose();
  };

  render() {
    const { classes, currentExperiment, experiments } = this.props;
    const { anchorElement, tabValue } = this.state;

    return (
      <Grid container className={classes.root}>
        <Grid item container xs={7} alignItems="flex-start">
          <Link to="/" className={classes.logo}>
            Argos
          </Link>
          <Divider orientation="vertical" className={classes.divider} />
          <Button
            aria-controls="header-menu"
            aria-haspopup="true"
            onClick={this.handleMenuClick}
            disableRipple
            className={classes.expandButton}
          >
            {currentExperiment.name && currentExperiment.id
              ? `${currentExperiment.name} (ID: ${currentExperiment.id})`
              : 'Select an Experiment'}
            <ExpandMoreIcon />
          </Button>
          <Menu
            id="header-menu"
            open={Boolean(anchorElement)}
            onClose={this.handleMenuClose}
            anchorEl={anchorElement}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
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
        <Grid item container xs={5} justify="flex-end">
          <StyledTabs
            value={tabValue}
            onChange={this.handleTabChange}
            aria-label="header tabs"
          >
            <Tab
              disableRipple
              label="Trials"
              id="header-tab-0"
              aria-controls="header-tabpanel-0"
              className={classes.tab}
            />
            <Tab
              disableRipple
              label="Assets"
              id="header-tab-1"
              aria-controls="header-tabpanel-1"
              className={classes.tab}
            />
            <Tab
              disableRipple
              label="Devices"
              id="header-tab-2"
              aria-controls="header-tabpanel-2"
              className={classes.tab}
            />
          </StyledTabs>
        </Grid>
        {/*  <TabPanel value={value} index={0}>
                Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel> */}
      </Grid>
    );
  }
}

export default withStyles(styles)(Header);
