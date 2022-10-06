import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import CustomInput from '../CustomInput';
import { styles } from './styles';

class CustomLocation extends React.Component {

  state = {

  };
  isCoordinatesValid = (coordinates) => {
    const validLat = !coordinates[0] || (coordinates[0] > -90 && coordinates[0] < 90)
    const validLong = !coordinates[1] || (coordinates[1] > -180 && coordinates[1] < 180)
    return validLat && validLong
  }

  handleChange = (e, name, value) => {
    const etidetValue = value;
    if (name !== 'name') {
      etidetValue.coordinates= etidetValue.coordinates || []
      etidetValue.coordinates[name] = e.target.value;
      if(!this.isCoordinatesValid(etidetValue.coordinates)) {
        return;
      }
    }
    else etidetValue[name] = e.target.value;
    const { onChange } = this.props;
    onChange({ target: { value: JSON.stringify(etidetValue) } });
  };

  render() {
    const { classes, id, withBorder, label } = this.props;
    let { value } = this.props;
    if (!value) value = { name: 'OSMMap', coordinates: ['', ''] };
    else value = JSON.parse(value);
    return (
      <Grid
        container
        direction="row"
        alignItems="center"
      >
        <CustomInput
          id={`location-name-${id}`}
          className={classes.property}
          onChange={e => this.handleChange(e, 'name', value)}
          value={value.name}
          values="OSMMap"
          type="selectList"
          withBorder={withBorder}
        />
        <CustomInput
          id={`location-coords-x-${id}`}
          className={classes.property}
          onChange={e => this.handleChange(e, 0, value)}
          label={label ? 'x' : null}
          placeholder="x"
          value={value.coordinates ? value.coordinates[0] : null}
          type="text"
          withBorder={withBorder}
        />
        <CustomInput
          id={`location-coords-y-${id}`}
          className={classes.property}
          onChange={e => this.handleChange(e, 1, value)}
          label={label ? 'y' : null}
          placeholder="y"
          value={value.coordinates ? value.coordinates[1] : null}
          type="text"
          withBorder={withBorder}
        />
      </Grid>
    );
  }
}

export default withStyles(styles)(CustomLocation);
