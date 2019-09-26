import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import classnames from 'classnames';
import { styles } from './styles';

const SimpleButton = ({ className, classes, onClick, text, variant, colorVariant }) => (
  <Button
    variant={variant || 'contained'}
    color={colorVariant || 'default'}
    className={classnames(classes.root, className)}
    onClick={onClick}
  >
    {text}
  </Button>
);

export default withStyles(styles)(SimpleButton);
