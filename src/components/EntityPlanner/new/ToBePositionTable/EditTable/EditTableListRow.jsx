import React from 'react'
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import AddBoxIcon from '@material-ui/icons/AddBox';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import { ReactComponent as ExpandLess } from './ExpandLess.svg';
import { ReactComponent as ExpandMore } from './ExpandMore.svg';
import { Divider, IconButton, ListItemSecondaryAction } from '@material-ui/core';

const EditTableListRow = ({ classes, deviceProps }) => {

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem button onClick={handleClick}>

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
        <List className={classes.list} component="div" disablePadding>

          <ListItem button className={classes.nested}>
            <ListItemText primary={deviceProps.type} />
            <ListItemText secondary="50cm" />
            <ListItemText secondary="Samsung" />
            <ListItemText secondary="blabla23" />
            <ListItemText secondary="20kg" />
            <IconButton className={classes.iconButton}>
              <LocationOnOutlinedIcon />
            </IconButton>

            <ListItemSecondaryAction className={classes.addIconWrapper}>
              <IconButton className={classes.iconButton}>
                <AddBoxIcon fontSize="large" color="primary" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>

        </List>
      </Collapse>

      {!open && <Divider light />}

    </>
  )
}

export default EditTableListRow