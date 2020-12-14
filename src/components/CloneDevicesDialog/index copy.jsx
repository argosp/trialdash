import React from "react";
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
import { compose } from "recompose";
import SimpleButton from "../SimpleButton";
import trialsQuery from '../TrialContext/utils/trialQuery.js';

import { styles } from "./styles";


  function CloneDevicesDialog( {title, open, setOpen, onConfirm, currentTrial}) {
    console.log('title ',title,'open',open);
    const [text, setText] = React.useState("");
    // const [updateTrial, setUpdateTrial] = React.useState(currentTrial);
    const [trials, setTrials] = React.useState();


// useEffect(() => {
//   if (dataConfirm && dataConfirm.confirmRegistration) {
//     setGlobalUser({user: {...globalUser,status:'verified'}});
//     complete();
//   }
//   if (errorConfirm) {
//     console.log(error);
//   }
// }, [dataConfirm, errorConfirm]);

const getItemsFromServer = () => {
  // const {  client ,match } = this.props;

  // client
  //   .query({
  //     query:trialsQuery(match.params.id, match.params.trialSetKey)
  //   })
  //   .then((data) => {
  //     console.log('dataaa in getItemsFromServer ',data)
  //     data.data[trials] = data.data.trials.filter(d => d.state !== 'Deleted');
  //     setTrials(data.data[trials]);
  //   });
};
// const handleChange = (field) => (event) => {
//     this.setState({ [field]: event.target.value });
//   };
// const  handleSelectedTrial = (selectedTrial) => {
//     console.log("handleSelectedTrial", updateTrial);
//     //clone entites from selectedTrial to updateTrial
//   };
   
    return (
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="customized-dialog-title"
      >
        <DialogTitle
          id="customized-dialog-title"
          className={styles.root}
          disableTypography
        >
          <Typography variant="h6">{title}</Typography>
          <IconButton aria-label="close" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Trials:

          </DialogContentText>
        
        </DialogContent>
        <DialogActions>
          <SimpleButton
            variant="outlined"
            onClick={() => {
              setOpen(false);
              onConfirm({dd:"ss"});//updateTrial
            }}
            text="SAVE"
          />
        </DialogActions>
      </Dialog>
    );
  
}

export default compose(withStyles(styles))(CloneDevicesDialog);
