import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { BasketIcon } from "../../constants/icons";

const NestedAccordion = ({ data, removeEntity }) => {

    const useStyles = makeStyles({
        root: {
          width: "100%",
        },
      });
      const handleClick = (itemKey) => {
          //remove item form data
        console.log("item.key ", itemKey);
        removeEntity(itemKey);
      };
      
      const printRrecursive = (obj) => {
        if (!obj.subItems || !obj.subItems.length) return;
        return obj.subItems.map((item) => (
          <Accordion key={item.key}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions3-content"
              id="additional-actions3-header"
            >
              <FormControlLabel
                aria-label="name"
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
                control={<BasketIcon onClick={() => handleClick(item.key)} />}
                label={item.name || item.key}
              />
            </AccordionSummary>
            <AccordionDetails>{printRrecursive(item)}</AccordionDetails>
          </Accordion>
        ));
      };

  const classes = useStyles();
  return <div className={classes.root}>{printRrecursive(data)}</div>;
};

export default NestedAccordion;
