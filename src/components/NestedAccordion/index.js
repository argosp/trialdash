import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

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
          control={<Checkbox />}
          label={item.name || item.key}
        />
      </AccordionSummary>
      <AccordionDetails>
        {printRrecursive(item)}
      </AccordionDetails>
    </Accordion>
  ));
};
const NestedAccordion = ({ data }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {printRrecursive(data)}
    </div>
  );
};

export default NestedAccordion;
