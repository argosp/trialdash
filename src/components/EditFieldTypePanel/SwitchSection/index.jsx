import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import classnames from 'classnames';
import { styles, switcher } from './styles';

const CustomSwitch = withStyles(switcher)(Switch);

class SwitchSection extends React.Component {
  state = {
    isSwitchChecked: false,
  };

  changeSwitch = () => {
    this.setState(state => ({ isSwitchChecked: !state.isSwitchChecked }));
    // this.props.switchHandler();
  };

  render() {
    const { title, description, classes, className } = this.props;
    const { isSwitchChecked } = this.state;

    return (
      <Grid
        container
        justify="space-between"
        wrap="nowrap"
        className={classnames(classes.root, className)}
      >
        <Grid item>
          <p className={classes.title}>{title}</p>
          <p className={classes.description}>{description}</p>
        </Grid>
        <Grid item>
          <CustomSwitch
            checked={isSwitchChecked}
            onChange={this.changeSwitch}
            inputProps={{ 'aria-label': 'switch' }}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(SwitchSection);
