import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import classnames from 'classnames';
import { styles } from './styles';

const SimpleButton = ({
  className,
  classes,
  onClick,
  text,
  variant = 'contained',
  colorVariant = 'default',
  size = 'normal',
  disabled = false,
  component = 'button',
  fullWidth= false,
  labelClassName,
  href
}) => (
  <Button
    variant={variant}
    fullWidth={fullWidth}
    component={component}
    color={colorVariant}
    disabled={disabled}
    className={
      size === 'small'
        ? classnames(classes.rootSmall, className)
        : classnames(classes.root, className)
    }
    onClick={onClick}
    classes={{label: labelClassName}}
    href={href}
  >
    {text}
  </Button>
);

export default withStyles(styles)(SimpleButton);
