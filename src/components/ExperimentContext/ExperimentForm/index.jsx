import React from 'react';
import { withStyles } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';
import { Map, Marker, TileLayer } from 'react-leaflet';
import Graph from '../../../apolloGraphql';
import experimentMutation from './utils/experimentMutation';
import ContentHeader from '../../ContentHeader';
import Footer from '../../Footer';
import { styles } from './styles';
import CustomInput from '../../CustomInput';
import CustomTooltip from '../../CustomTooltip';
import { DateIcon } from '../../../constants/icons';
import config from '../../../config';

const graphql = new Graph();

class ExperimentForm extends React.Component {
  state = {
    formObject: {
      name: '',
      description: '',
      begin: new Date().toISOString(),
      end: new Date().toISOString(),
      location: '0,0',
      numberOfTrials: 0,
    },
    isStartDatePickerOpen: false,
    isEndDatePickerOpen: false,
  };

  startDatePickerRef = React.createRef();

  endDatePickerRef = React.createRef();

  submitExperiment = (newExperiment) => {
    graphql
      .sendMutation(experimentMutation(newExperiment))
      .then(() => {
        this.props.history.push('/experiments');
      })
      .catch((err) => {
        console.log(`error: ${err}`);
      });
  };

  changeFormObject = (event, field) => {
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
      default:
        ({ value } = event.target);
    }

    this.setState(state => ({
      formObject: {
        ...state.formObject,
        [field]: value,
      },
    }));
  };

  setIsDatePickerOpen = (field, isOpen) => {
    this.setState({ [field]: isOpen });
  };

  render() {
    const { history, classes } = this.props;
    const {
      formObject,
      isStartDatePickerOpen,
      isEndDatePickerOpen,
    } = this.state;

    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <ContentHeader className={classes.header} title="Add experiment" />
        <form>
          <Grid container>
            <Grid item xs={4}>
              <CustomInput
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
            <Grid item xs={4}>
              <CustomInput
                value={formObject.location}
                className={classes.locationInput}
                onChange={e => this.changeFormObject(e, 'location')}
                id="location-input"
                label="Location"
              />
              <Map
                center={formObject.location.split(',')}
                zoom={13}
                className={classes.map}
                onClick={e => this.changeFormObject(e, 'location')}
                attributionControl={false}
              >
                <TileLayer
                  url={`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${config.mapboxAccessToken}`}
                  id="mapbox.streets"
                />
                <Marker position={formObject.location.split(',')} />
              </Map>
            </Grid>
          </Grid>
        </form>
        <Footer
          cancelButtonHandler={() => history.push('/experiments')}
          saveButtonHandler={() => this.submitExperiment(formObject)}
        />
      </MuiPickersUtilsProvider>
    );
  }
}

export default withStyles(styles)(ExperimentForm);
