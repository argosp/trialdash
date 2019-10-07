import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import { styles } from './styles';

class RightPanelContainer extends React.Component {
  state = {
    isPanelOpen: true,
  };

  closePanel = () => {
    this.setState({ isPanelOpen: false });
    this.props.onClose();
  };

  render() {
    const { classes, title, children } = this.props;
    const { isPanelOpen } = this.state;

    return (
      <div className={isPanelOpen ? classes.root : classes.hiddenRoot}>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.headerWrapper}
        >
          {title}
          <CloseIcon
            fontSize="large"
            className={classes.closeIcon}
            onClick={this.closePanel}
          />
        </Grid>
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(RightPanelContainer);
