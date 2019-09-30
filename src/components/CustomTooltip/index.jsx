import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
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
    const { classes, title, children, className, placement } = this.props;

    return (
      <Tooltip
        placement={placement || 'top'}
        className={className}
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
        {children}
      </Tooltip>
    );
  }
}
export default withStyles(styles)(CustomTooltip);
