import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const NestedAccordion = ({ data, removeEntity }) => {
  //no inner subItems - check in old github code
  const useStyles = makeStyles({
    root: {
      width: "100%",
    },
  });

  const printRrecursive = (obj) => {
    if (!obj.subItems || !obj.subItems.length) return;
    return obj.subItems.map(
      (item) =>
        !item.deleted && (
          <Accordion key={item.key}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions3-content"
              id="additional-actions3-header"
            >
              {item.name || item.key}
              {/*  TODO:by new issue  <FormControlLabel
                aria-label="name"
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
                control={<BasketIcon onClick={() => handleClick(item.key)} />}
                label={item.name || item.key}
              /> */}
            </AccordionSummary>
            <AccordionDetails>{printRrecursive(item)}</AccordionDetails>
          </Accordion>
        )
    );
  };

  const classes = useStyles();
  return <div className={classes.root}>{printRrecursive(data)}</div>;
};

export default NestedAccordion;
