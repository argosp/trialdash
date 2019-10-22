import React from 'react';
import { withStyles } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';
import { Map, Marker, TileLayer } from 'react-leaflet';
// import Graph from '../../../apolloGraphql';
// import experimentMutation from './utils/experimentMutation';
import { EXPERIMENTS_CONTENT_TYPE } from '../../../constants/base';
import ContentHeader from '../../ContentHeader';
import Footer from '../../Footer';
import { styles } from './styles';
import CustomInput from '../../CustomInput';
import CustomTooltip from '../../CustomTooltip';
import { DateIcon } from '../../../constants/icons';
import config from '../../../config';

// const graphql = new Graph();

class ExperimentForm extends React.Component {
  /*
  submitExperiment = () => {
    this.setState({ errors: {} });
    if (!this.state.name || this.state.name.trim() === '') {
      this.setState({ errors: { name: true } });
      return;
    }
    const newExperiment = {
      // id: this.state.id,
      name: this.state.name,
      begin: this.state.begin,
      end: this.state.end,
    };

    const self = this;

    graphql
      .sendMutation(experimentMutation(newExperiment))
      .then((data) => {
        window.alert(`saved experiment ${data.addUpdateExperiment.id}`);
        if (self.props.close) self.props.close();
      })
      .catch((err) => {
        window.alert(`error: ${err}`);
      });
  }; */

  state = {
    formObject: {
      name: '',
      description: '',
      begin: new Date().toISOString(),
      end: new Date().toISOString(),
      location: '0,0',
    },
    isStartDatePickerOpen: false,
    isEndDatePickerOpen: false,
  };

  startDatePickerRef = React.createRef();

  endDatePickerRef = React.createRef();

  changeFormObject = (event, field) => {
    let value;

    switch (field) {
      case 'begin':
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
    const { changeContentType, classes } = this.props;
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
              <Grid container spacing={2}>
                <Grid item xs={5} ref={this.startDatePickerRef}>
                  <DatePicker
                    onClose={() => this.setIsDatePickerOpen('isStartDatePickerOpen', false)
                    }
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
                        className={classes.input}
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
                <Grid item xs={5} ref={this.endDatePickerRef}>
                  <DatePicker
                    onClose={() => this.setIsDatePickerOpen('isEndDatePickerOpen', false)
                    }
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
                        className={classes.input}
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
          cancelButtonHandler={() => changeContentType(EXPERIMENTS_CONTENT_TYPE)
          }
          // saveButtonHandler={() => this.submitEntity(this.state.formObject)}
        />
      </MuiPickersUtilsProvider>
    );
  }
}

export default withStyles(styles)(ExperimentForm);
