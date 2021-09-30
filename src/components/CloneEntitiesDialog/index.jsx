import React, { useEffect, useState, useRef } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { compose } from "recompose";
import SimpleButton from "../SimpleButton";
import trialsQuery from "../TrialContext/utils/trialQuery.js";

import { styles } from "./styles";
const StyledListItem = withStyles({
  root: {
    "&.Mui-selected": {
      backgroundColor: "#eceff1",
    },
  },
})(ListItem);
function CloneEntitiesDialog({
  title,
  open,
  setOpen,
  onConfirm,
  currentTrial,
  entitiesTypes,
  client,
  match,
}) {
  const [updateTrial, setUpdateTrial] = React.useState(currentTrial);
  const [trials, setTrials] = React.useState();
  const [selectedTrial, setSelectedTrial] = React.useState();
  const [selectedTrialStatus, setSelectedTrialStatus] = React.useState();
  const [entitiesTypesOfSelectedTrial, setEntitiesTypesOfSelectedTrial] =
    useState();
  const [selectedEntitiesTypeKey, setSelectedEntitiesTypeKey] =
    React.useState();
  useEffect(() => {
    if (selectedTrialStatus && selectedTrial) {
      setOpen(false);
      onConfirm(updateTrial);
    }
  }, [updateTrial]);

  useEffect(() => {
    if (!trials) {
      getTrials();
    }
  }, []);

  const getTrials = () => {
    client
      .query({
        query: trialsQuery(match.params.id, match.params.trialSetKey),
      })
      .then((data) => {
        data.data[trials] = data.data.trials.filter(
          (d) => d.state !== "Deleted"
        );
        setTrials(data.data[trials]);
      });
  };
  const getEntitiesByEntitiesTypeKey = () => {
    if (selectedEntitiesTypeKey)
      return updateTrial.entities.concat(
        selectedTrial.entities.filter(
          (e) => e.entitiesTypeKey == selectedEntitiesTypeKey
        )
      );
    return updateTrial.entities.concat(selectedTrial.entities);
  };

  const cloneEntitiesFromSelectedTrial = () => {
    let entities;
    if (selectedTrialStatus == "design") {
      if (updateTrial.status == "design")
        setUpdateTrial({
          ...updateTrial,
          entities: getEntitiesByEntitiesTypeKey(),
        });
      else
        setUpdateTrial({
          ...updateTrial,
          deployedEntities: getEntitiesByEntitiesTypeKey(),
        });
    } else if (selectedTrialStatus == "deploy") {
      if (updateTrial.status == "design")
        setUpdateTrial({
          ...updateTrial,
          deployedEntities: updateTrial.entities.concat(
            selectedTrial.deployedEntities
          ),
        });
      else
        setUpdateTrial({
          ...updateTrial,
          deployedEntities: updateTrial.deployedEntities.concat(
            selectedTrial.deployedEntities
          ),
        });
    }
  };
  const getEntitiesTypeFromSelectedTrial = (trial) => {
    //TODO: refactor outside of this component
    const entitiesTypeKeyArr = trial.entities.map((obj) => {
      return obj.entitiesTypeKey;
    });
    const x = Object.entries(entitiesTypes)
      .filter((e) => entitiesTypeKeyArr.indexOf(e[0]) != -1)
      .map((item) => item[1][0]);
    setEntitiesTypesOfSelectedTrial(x);
  };
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="customized-dialog-title"
    >
      <DialogTitle
        id="customized-dialog-title"
        style={{ display: "flex", justifyContent: "space-between" }}
        disableTypography
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton
          aria-label="close"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <List component="nav">
          <Typography variant="h6"> Select trial to clone from:</Typography>
          {trials &&
            trials.map((trial) => (
              <StyledListItem
                selected={selectedTrial && trial.key === selectedTrial.key}
                key={trial.key}
                button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTrial(trial);
                  getEntitiesTypeFromSelectedTrial(trial);
                }}
              >
                <ListItemText primary={trial.name} />
              </StyledListItem>
            ))}
        </List>
        <List component="nav">
          {selectedTrial &&
            selectedTrial.entities &&
            entitiesTypesOfSelectedTrial && (
              <>
                <Typography variant="h6">
                  {" "}
                  Select entity type (Optional):
                </Typography>
                {entitiesTypesOfSelectedTrial.map((element) => (
                  <StyledListItem
                    key={element.key}
                    selected={
                      selectedEntitiesTypeKey &&
                      element.key === selectedEntitiesTypeKey
                    }
                    button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEntitiesTypeKey(element.key);
                    }}
                  >
                    <ListItemText primary={element.name} />
                  </StyledListItem>
                ))}{" "}
              </>
            )}
        </List>
        <DialogActions style={{ justifyContent: "end" }}>
          {selectedTrial && (
            <FormControl component="fieldset" style={{ display: "flex" }}>
              <Typography variant="h6">Copy entities from:</Typography>
              <RadioGroup
                aria-label="copy-from"
                name="opyFrom"
                value={selectedTrialStatus}
                onChange={(e) => setSelectedTrialStatus(e.target.value)}
              >
                <FormControlLabel
                  value="design"
                  disabled={!selectedTrial}
                  control={<Radio />}
                  label="design"
                />
                <FormControlLabel
                  value="deploy"
                  disabled={
                    !selectedTrial ||
                    (selectedTrial && !selectedTrial.deployedEntities.length)
                  }
                  control={<Radio />}
                  label="deploy"
                />
              </RadioGroup>
            </FormControl>
          )}
        </DialogActions>
      </DialogContent>
      <SimpleButton
        variant="outlined"
        disabled={!selectedTrial || !selectedTrialStatus}
        onClick={() => {
          cloneEntitiesFromSelectedTrial();
        }}
        text="CLONE"
      />
    </Dialog>
  );
}

export default compose(withStyles(styles))(CloneEntitiesDialog);
