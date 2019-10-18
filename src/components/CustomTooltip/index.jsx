import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { styles } from './styles';

class CustomTooltip extends React.Component {
  state = {
    arrowRef: null,
  };

  handleArrowRef = (node) => {
    this.setState({
      arrowRef: node,
    });
  };

  render() {
    const { classes, title, children, className, placement, ariaLabel, onClick } = this.props;

    return (
      <Tooltip
        placement={placement || 'top'}
        className={classnames(classes.root, className)}
        title={(
          <React.Fragment>
            {title}
            <span className={classes.arrow} ref={this.handleArrowRef} />
          </React.Fragment>
         )}
        classes={{
          tooltip: classes.tooltip,
          popper: classes.popper,
          tooltipPlacementLeft: classes.placementLeft,
          tooltipPlacementRight: classes.placementRight,
          tooltipPlacementTop: classes.placementTop,
          tooltipPlacementBottom: classes.placementBottom,
        }}
        PopperProps={{
          popperOptions: {
            modifiers: {
              arrow: {
                enabled: Boolean(this.state.arrowRef),
                element: this.state.arrowRef,
              },
            },
          },
        }}
      >
        <IconButton
          aria-label={ariaLabel}
          onClick={onClick}
          disableRipple
        >
          {children}
        </IconButton>
      </Tooltip>
    );
  }
}
export default withStyles(styles)(CustomTooltip);
