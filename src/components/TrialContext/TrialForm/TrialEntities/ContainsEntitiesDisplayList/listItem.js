import React, { useEffect, useState } from "react";
import CustomTooltip from "../../../../CustomTooltip";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Collapse from "@material-ui/core/Collapse";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { BasketIcon } from "../../../../../constants/icons";
const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.black,
      },
    },
  },
}))(MenuItem);
const ListItem = ({ entity, entities, classes }) => {
  return (
    <StyledMenu
      id="customized-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <StyledMenuItem>
        <BasketIcon
          onClick={() => console.log("clicked item", entity)}
        ></BasketIcon>
        <ListItemText primary={entities[entity.key][0].name} />
      </StyledMenuItem>
    </StyledMenu>
  );
};
export default ListItem;
