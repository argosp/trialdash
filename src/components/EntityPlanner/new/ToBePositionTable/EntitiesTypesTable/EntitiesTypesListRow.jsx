import React from 'react'
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import { ReactComponent as ExpandLess } from './ExpandLessIcon.svg';
import { ReactComponent as ExpandMore } from './ExpandMoreIcon.svg';
import { Divider, IconButton } from '@material-ui/core';

const EntitiesTypesListRow = ({ classes, deviceProps, children }) => {

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem style={{ zIndex: 20000 }} button onClick={handleClick}>

        <IconButton disabled>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>

        <ListItemText className={classes.rowTitleText} disableTypography children="Device Type" />

        <ListItemText align="center" className={classes.flexItem1}>
          {/* positioned */}
          <Typography variant="span" className={classes.colRowText}>
            1
          </Typography>
        </ListItemText>

        <ListItemText align="center" className={classes.flexItem1}>
          {/* not positioned */}
          <Typography variant="span" className={classes.colRowText}>
            2
          </Typography>
        </ListItemText>
      </ListItem>

      <Collapse in={open} timeout="auto">
        {children}
      </Collapse>

      {!open && <Divider light />}

    </>
  )
}

export default EntitiesTypesListRow