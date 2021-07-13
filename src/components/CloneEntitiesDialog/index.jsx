import React, { useEffect, useState, useRef } from "react";
import TextField from "@material-ui/core/TextField";
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
import FormLabel from "@material-ui/core/FormLabel";
import { compose } from "recompose";
import SimpleButton from "../SimpleButton";
import trialsQuery from "../TrialContext/utils/trialQuery.js";

import { styles } from "./styles";

function CloneEntitiesDialog({
  title,
  open,
  setOpen,
  onConfirm,
  currentTrial,
  client,
  match,
}) {
  const [text, setText] = React.useState("");
  const [updateTrial, setUpdateTrial] = React.useState(currentTrial);
  const [trials, setTrials] = React.useState();
  const [selectedTrial, setSelectedTrial] = React.useState();
  const [selectedTrialStatus, setSelectedTrialStatus] = React.useState();

  useEffect(() => {
    if (selectedTrialStatus && selectedTrial) cloneEntitiesFromSelectedTrial();
  }, [selectedTrialStatus]);

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
  const cloneEntitiesFromSelectedTrial = () => {
    if (selectedTrialStatus == "design") {
      if (updateTrial.status == "design")
        setUpdateTrial({
          ...updateTrial,
          entities: updateTrial.entities.concat(selectedTrial.entities),
        });
      else
        setUpdateTrial({
          ...updateTrial,
          deployedEntities: updateTrial.entities.concat(selectedTrial.entities),
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

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="customized-dialog-title"
    >
      <DialogTitle
        id="customized-dialog-title"
        style={{"display": 'flex'}}
        disableTypography
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton aria-label="close" onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          <List component="nav">
            {trials &&
              trials.map((trial) => (
                <ListItem
                  key={trial.key}
                  button
                  onClick={() => {
                    setSelectedTrial(trial);
                  }}
                >
                  <ListItemText primary={trial.name} />
                </ListItem>
              ))}
          </List>
        </DialogContentText>
      </DialogContent>
      <DialogActions 
      style={{"justifyContent": 'end'}}
        > 
        {selectedTrial && (
          <FormControl component="fieldset">
            <FormLabel component="legend">Copy entities from:</FormLabel>
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
        {/* <SimpleButton
          variant="outlined"
          onClick={() => {
            setOpen(false);
            onConfirm(updateTrial);
          }}
          text="SAVE"
        /> */}
      </DialogActions>
    </Dialog>
  );
}

export default compose(withStyles(styles))(CloneEntitiesDialog);
