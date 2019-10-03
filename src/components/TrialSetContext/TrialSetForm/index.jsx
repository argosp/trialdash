import React from 'react';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';
import Graph from '../../../apolloGraphql';
import { TRIAL_SETS_CONTENT_TYPE } from '../../../constants/base';
import AddForm from '../../AddForm';
import FieldTypesPanel from '../../FieldTypesPanel';
import trialSetMutation from './utils/trialSetMutation';

const graphql = new Graph();

class TrialSetForm extends React.Component {
  /*  handleChange = key => (event) => {
    this.setState({
      [key]: event.target.value,
    });
  }; */

  /*  handleChangeProprty = (index, key) => (event) => {
    this.state.properties[index][key] = event.target.value;
    this.setState({});
  }; */

    submitTrialSet = (newTrialSet) => {
      graphql
        .sendMutation(trialSetMutation(newTrialSet))
        .then((data) => {
          window.alert(`saved trialSet ${data.addUpdateTrialSet.name}`);
        })
        .catch((err) => {
          window.alert(`error: ${err}`);
        });
    };

    /*  addProperty = () => {
    this.state.properties.push({ key: '', val: '' });
    this.setState({});
  }; */

  cancelForm = () => {
    this.props.changeContentType(TRIAL_SETS_CONTENT_TYPE);
  };

  render = () => (
    <>
      <AddForm
        initialValues={{
          id: '',
          name: '',
          description: '',
          experimentId: this.props.experimentId,
          numberOfTrials: 0,
          properties: [],
        }}
        withFooter
        rightPanel={<FieldTypesPanel />}
        cancelFormHandler={this.cancelForm}
        saveFormHandler={this.submitTrialSet}
        headerTitle="Add trial set"
        headerDescription="a short description of what it means to add a device here"
        commonInputs={[
          {
            key: 0,
            id: 'trial-set-name',
            label: 'Name',
            description: 'a short description about the device name',
          },
          {
            key: 1,
            id: 'trial-set-id',
            label: 'ID',
            description: 'a short description about the device name',
          },
        ]}
        descriptionInput={{
          id: 'trial-set-description',
          label: 'Description',
          description: 'a short description about the device name',
        }}
      />
      {/* <form
        className={classes.container}
        noValidate
        autoComplete="off"
        style={{ textAlign: 'left' }}
        >
        <TextField
          style={{ width: '300px', marginTop: '30px' }}
          id="name"
          label="Name"
          type="text"
          className={classes.textField}
          value={this.state.name}
          onChange={this.handleChange('name')}
        />
        <br />
        <TextField
          style={{ width: '300px', marginTop: '30px' }}
          id="notes"
          label="Notes"
          type="text"
          className={classes.textField}
          value={this.state.notes}
          onChange={this.handleChange('notes')}
        />
        <br />
        <h3>properties:</h3>
        {this.state.properties.map((p, i) => (
          <div key={i} style={{ display: 'flex' }}>
            <TextField
              style={{ width: '300px' }}
              label="name"
              className={classes.textField}
              value={p.key}
              onChange={this.handleChangeProprty(i, 'key')}
            />
            <br />
            <InputLabel htmlFor="select-multiple-chip">Type</InputLabel>
            <Select
              value={p.val}
              onChange={this.handleChangeProprty(i, 'val')}
                // input={<Input id="select-multiple-chip" />}
                // renderValue={selected => (<Chip label={selected.id} className={classes.chip} />)}
            >
              {this.state.options && this.state.options.map(o => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </Select>
            <br />
          </div>
        ))}

        <Button
          variant="contained"
          className={classes.button}
          style={{ width: '180px' }}
          onClick={this.addProperty}
        >
                    + Add Property
        </Button>
        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <Button
            variant="contained"
            className={classes.button}
            style={{ width: '180px' }}
            onClick={this.submitTrialSet}
          >
                        Submit
          </Button>
          {this.props.cancel && (
          <Button
            variant="contained"
            className={classes.button}
            style={{ width: '180px' }}
            onClick={this.props.showAll}
          >
                        Cancel
          </Button>
          )}
        </div>
      </form> */}
    </>
  );
}

export default TrialSetForm;
