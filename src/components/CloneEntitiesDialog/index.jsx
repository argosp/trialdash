import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { withStyles } from '@mui/styles';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { compose } from "recompose";
import SimpleButton from "../SimpleButton";
import _ from "lodash";
import trialSetQuery from "../TrialContext/utils/trialSetQuery";
import trialsQuery from "../TrialContext/utils/trialQuery";
import DuplicateEntitiesDialog from './DuplicateEntitiesDialog';
import { getCurrentEntitsNameByStatus, getEntitiesByEntitiesTypeKey, getEntitiesTypeArrayFromSelectedTrial } from '../../assets/Utils';
import { styles } from "./styles";
import { WorkingContext } from "../AppLayout";
const StyledListItem = withStyles({
  root: {
    "&.Mui-selected": {
      backgroundColor: "#eceff1",
    },
  },
})(ListItem);

function CloneEntitiesDialog({
  title,
  onConfirm,
  currentTrial,
  entitiesTypes,
  client,
  match,
}, ref) {
  const { setRefreshMessage } = useContext(WorkingContext);
  const [updateTrial, setUpdateTrial] = React.useState(currentTrial);
  const [open, setOpen] = useState(false)
  const [trialSets, setTrialSets] = React.useState();
  const [trials, setTrials] = React.useState();
  const [selectedTrialSet, setSelectedTrialSet] = React.useState();
  const [selectedTrial, setSelectedTrial] = React.useState();
  const [selectedTrialStatus, setSelectedTrialStatus] = React.useState();
  const [entitiesTypesOfSelectedTrial, setEntitiesTypesOfSelectedTrial] =
    useState();
  const [selectedEntitiesTypeKey, setSelectedEntitiesTypeKey] = useState();
  const [isDupicateEntitiesDialogOpen, setIsDupicateEntitiesDialogOpen] = useState(false)
  const entitiesDataForClone = useRef()

  useEffect(() => {
    if (selectedTrialStatus && selectedTrial) {
      setOpen(false);
      onConfirm(updateTrial);
    }
  }, [updateTrial]);

  const openDialog = () => {
    setOpen(true)
  }
  useImperativeHandle(ref, () => ({
    openDialog
  }));


  useEffect(() => {
    getTrialSets()
  }, []);

  useEffect(() => {
    if (selectedTrialSet) {
      getTrials()
    }
  }, [selectedTrialSet])

  const getTrialSets = () => {
    client
      .query({
        query: trialSetQuery(match.params.id),
      })
      .then((data) => {
        setTrialSets(data.data['trialSets'])
      });
  };

  const getTrials = () => {
    client
      .query({
        query: trialsQuery(match.params.id, selectedTrialSet.key),
      })
      .then((data) => {
        data.data[trials] = data.data.trials.filter(
          (d) => d.state !== "Deleted"
        );
        setTrials(data.data[trials]);
      });
  };
  const mergeEntities = () => {
    setIsDupicateEntitiesDialogOpen(false);
    const array = entitiesDataForClone.current.new;
    entitiesDataForClone.current.old.forEach(element => {
      const find = array.find(q => q.key === element.key)
      if (!find) {
        array.unshift(element)
      }
    });
    if (updateTrial.status === "design")
      setUpdateTrial({
        ...updateTrial,
        entities: array,
      });
    else
      setUpdateTrial({
        ...updateTrial,
        deployedEntities: array,
      });
  }
  const areDuplicateEntities = (oldEntities, newEntities) => {
    const oldEntitiesKeys = _.map(oldEntities, 'key')
    const newEntitiesKeys = _.map(newEntities, 'key')
    const duplicateKeys = _.intersection(oldEntitiesKeys, newEntitiesKeys)
    return duplicateKeys.length ? true : false
  }

  const handleDuplicateEntitiesDialogClose = () => {
    setIsDupicateEntitiesDialogOpen(false);
  }

  const concatEntities = () => {
    let ent;
    if (selectedEntitiesTypeKey) ent = getEntitiesByEntitiesTypeKey(selectedTrial, selectedEntitiesTypeKey);
    const showOverideAlert = areDuplicateEntities(updateTrial.entities, ent || selectedTrial.entities)
    entitiesDataForClone.current = {
      old: updateTrial.entities,
      new: ent || selectedTrial.entities
    }
    if (showOverideAlert) {
      setIsDupicateEntitiesDialogOpen(true)
    } else {
      mergeEntities()
    }

  };

  const cloneEntitiesFromSelectedTrial = () => {
    switch (selectedTrialStatus) {
      case "design": {
        concatEntities()
        break;
      }
      case "deploy": {
        setUpdateTrial({
          ...updateTrial,
          deployedEntities: updateTrial[getCurrentEntitsNameByStatus(updateTrial).valueOf()].concat(
            selectedTrial.deployedEntities
          ),
        });
        break;
      }
      default:
        break;
    }
  };

  return (
    <>
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
            <Typography variant="h6"> Select trial set to clone from:</Typography>
            {trialSets &&
              trialSets.map((trialSet) => (
                <StyledListItem
                  selected={selectedTrialSet && trialSet.key === selectedTrialSet.key}
                  key={trialSet.key}
                  button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrialSet(trialSet);
                  }}
                >
                  <ListItemText primary={trialSet.name} />
                </StyledListItem>
              ))}
          </List>
          {trials && <List component="nav">
            <Typography variant="h6"> Select trial to clone from:</Typography>
            {trials.map((trial) => (
              <StyledListItem
                selected={selectedTrial && trial.key === selectedTrial.key}
                key={trial.key}
                button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTrial(trial);
                  setEntitiesTypesOfSelectedTrial(getEntitiesTypeArrayFromSelectedTrial(trial, entitiesTypes));
                }}
              >
                <ListItemText primary={trial.name} />
              </StyledListItem>
            ))}
          </List>}
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
                  name="copyFrom"
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
            setOpen(false)
            cloneEntitiesFromSelectedTrial()
            setRefreshMessage();
          }}
          text="CLONE"
        />
      </Dialog>
      {isDupicateEntitiesDialogOpen &&
        <DuplicateEntitiesDialog
          handleClose={handleDuplicateEntitiesDialogClose}
          handleAgree={mergeEntities}
        />}
    </>
  );
}
export default compose(withStyles(styles))(forwardRef(CloneEntitiesDialog));
