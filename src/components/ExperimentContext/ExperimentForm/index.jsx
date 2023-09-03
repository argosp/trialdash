import React from 'react';
import { withStyles } from '@mui/material';
import uuid from 'uuid/v4';
import { DatePicker } from '@material-ui/pickers';
import { Grid, Typography } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import moment from 'moment';
import { compose } from 'recompose';
import { withApollo } from 'react-apollo';
import experimentMutation from './utils/experimentMutation';
import ContentHeader from '../../ContentHeader';
import Footer from '../../Footer';
import { styles } from './styles';
import CustomInput from '../../CustomInput';
import CustomTooltip from '../../CustomTooltip';
import { DateIcon } from '../../../constants/icons';
import ConfirmDialog from '../../ConfirmDialog';
import { MapsEditTable } from './mapsEditTable';
import experimentsQuery from '../utils/experimentsQuery';
import { EXPERIMENT_MUTATION, EXPERIMENTS_WITH_DATA } from '../../../constants/base';
import { updateCache } from '../../../apolloGraphql';

class ExperimentForm extends React.Component {


  initFormObject = () => {
    return {
      key: this.props.experiment ? this.props.experiment.key : uuid(),
      projectId: this.props.experiment ? this.props.experiment.project.id : '',
      name: this.props.experiment ? this.props.experiment.name : '',
      description: this.props.experiment ? this.props.experiment.description : '',
      begin: this.props.experiment ? this.props.experiment.begin : new Date().toISOString(),
      end: this.props.experiment ? this.props.experiment.end : new Date().toISOString(),
      location: this.props.experiment ? this.props.experiment.location : '0,0',
      numberOfTrials: this.props.experiment ? this.props.experiment.numberOfTrials : 0,
      maps: this.props.experiment && this.props.experiment.maps ? this.props.experiment.maps : [
        // {imageUrl: "", imageName: 'fdsaf', lower: '3', right: '5', upper: '4', left: '6', embedded: true}
      ]
    }
  }
  state = {
    formObject: this.initFormObject(),
    isStartDatePickerOpen: false,
    isEndDatePickerOpen: false,
    confirmOpen: false
  };

  startDatePickerRef = React.createRef();

  endDatePickerRef = React.createRef();

  closeForm = (update) => {
    const { history, returnFunc } = this.props;

    if (returnFunc) returnFunc(update);
    else {
      history.push('/experiments');
    }
  };

  updateAfterSubmit = (n, cache, experiment) => {
    this.props.updateExperiment(experiment)
  }


  submitExperiment = async (newExperiment, deleted) => {
    const newEntity = newExperiment;
    const { client, returnFunc } = this.props;
    if (deleted) newEntity.state = 'Deleted';

    await client.mutate({
      mutation: experimentMutation(newEntity),
      update: (cache, mutationResult) => {
        updateCache(
          cache,
          mutationResult,
          experimentsQuery,
          EXPERIMENTS_WITH_DATA,
          EXPERIMENT_MUTATION,
          returnFunc,
          'experimentKey',
          this.updateAfterSubmit
        );
      },
    });
    this.setState({ changed: false });

    //this.closeForm(true);
  };

  changeFormObject = (event, field, data) => {
    let value;

    switch (field) {
      case 'begin':
        value = moment.utc(event).format();

        // if the end date is earlier than the start date set end date is equal to the start date
        if (event.isAfter(this.state.formObject.end, 'day')) {
          this.setState(state => ({
            formObject: {
              ...state.formObject,
              end: value,
            },
          }));
        }

        break;
      case 'end':
        value = moment.utc(event).format();
        break;
      case 'location':
        if (event.target.value) {
          // regexp to check coordinates string
          const areCoordinatesValid = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(
            event.target.value,
          );

          if (areCoordinatesValid) ({ value } = event.target);
          else return;
        } else value = `${event.latlng.lat},${event.latlng.lng}`;
        break;
      case 'maps':
        return;
      default:
        ({ value } = event.target);
    }

    this.setState(state => ({
      formObject: {
        ...state.formObject,
        [field]: value,
      },
      changed: true
    }));
  };

  setIsDatePickerOpen = (field, isOpen) => {
    this.setState({ [field]: isOpen });
  };

  setConfirmOpen = (open) => {
    this.setState({ confirmOpen: open });
  }
  cancelHandler = () => {
    this.setState({
      formObject: this.initFormObject(),
      changed: false
    })
  }

  render() {
    const { classes, client } = this.props;
    const {
      formObject,
      isStartDatePickerOpen,
      isEndDatePickerOpen,
      confirmOpen,
    } = this.state;

    return (
      <>
        <ContentHeader
          backButtonHandler={this.closeForm}
          withBackButton
          className={classes.header}
          title={this.props.experiment ? 'Edit experiment' : 'Add experiment'} />
        <form>
          <Grid container>
            <Grid item xs={4}>
              <CustomInput
                value={formObject.name}
                onChange={e => this.changeFormObject(e, 'name')}
                id="experiment-name"
                label="Name"
                bottomDescription="a short description about the name"
                className={classes.input}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={7}>
              <CustomInput
                value={formObject.description}
                onChange={e => this.changeFormObject(e, 'description')}
                id="experiment-description"
                label="Description"
                bottomDescription="a short description about the description"
                className={classes.input}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={5}>
              <Grid container spacing={2} className={classes.dates}>
                <Grid item xs={5} ref={this.startDatePickerRef}>
                  <DatePicker
                    onClose={() => this.setIsDatePickerOpen('isStartDatePickerOpen', false)}
                    disableToolbar
                    variant="inline"
                    format="D/M/YYYY"
                    id="start-date-picker"
                    label="Start date"
                    value={formObject.begin}
                    onChange={date => this.changeFormObject(date, 'begin')}
                    open={isStartDatePickerOpen}
                    PopoverProps={{
                      anchorEl: this.startDatePickerRef.current,
                    }}
                    TextFieldComponent={props => (
                      <CustomInput
                        {...props}
                        onClick={() => this.setIsDatePickerOpen(
                          'isStartDatePickerOpen',
                          true,
                        )}
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <CustomTooltip
                                className={classes.dateTooltip}
                                title="Select date"
                                ariaLabel="select date"
                                onClick={() => this.setIsDatePickerOpen(
                                  'isStartDatePickerOpen',
                                  true,
                                )}
                              >
                                <DateIcon />
                              </CustomTooltip>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={5} ref={this.endDatePickerRef}>
                  <DatePicker
                    onClose={() => this.setIsDatePickerOpen('isEndDatePickerOpen', false)}
                    minDate={formObject.begin} // the end date can't be earlier than the start date
                    disableToolbar
                    variant="inline"
                    format="D/M/YYYY"
                    id="end-date-picker"
                    label="End date"
                    value={formObject.end}
                    onChange={date => this.changeFormObject(date, 'end')}
                    open={isEndDatePickerOpen}
                    PopoverProps={{
                      anchorEl: this.endDatePickerRef.current,
                    }}
                    TextFieldComponent={props => (
                      <CustomInput
                        {...props}
                        onClick={() => this.setIsDatePickerOpen(
                          'isEndDatePickerOpen',
                          true,
                        )}

                        inputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <CustomTooltip
                                className={classes.dateTooltip}
                                title="Select date"
                                ariaLabel="select date"
                                onClick={() => this.setIsDatePickerOpen(
                                  'isEndDatePickerOpen',
                                  true,
                                )
                                }
                              >
                                <DateIcon />
                              </CustomTooltip>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6">
                Images and locations
              </Typography>
              <MapsEditTable
                setData={(data) => this.setState(state => ({
                  formObject: {
                    ...state.formObject,
                    maps: data,
                  },
                  changed: true
                }))}
                data={formObject.maps}
                client={client}
              />
            </Grid>
          </Grid>
        </form>
        <Footer
          cancelButtonHandler={this.cancelHandler}
          saveButtonDisabled={!this.state.changed}
          saveButtonHandler={() => this.submitExperiment(formObject)}
          cancelButtonDisabled={!this.state.changed}
        />
        <ConfirmDialog
          title="Delete Experiment"
          open={confirmOpen}
          setOpen={this.setConfirmOpen}
          onConfirm={() => this.submitExperiment(formObject, true)}
          inputValidation
        >
          Are you sure you want to delete this experiment?
        </ConfirmDialog>
      </>
    );
  }
}

export default compose(
  withApollo,
  withStyles(styles),
)(ExperimentForm);
