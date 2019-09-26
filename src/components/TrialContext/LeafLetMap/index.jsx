import React from 'react';
import TextField from '@material-ui/core/TextField';
import config from '../../../config';

class LeafLetMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: `mapid${Math.random(100)}`,
    };
  }

  componentDidMount() {
    const self = this;
    self.markers = [];
    const { location } = self.props;
    self.mymap = window.L.map(this.state.id).setView(location, 13);
    window.L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${config.mapboxAccessToken}`, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: config.mapboxAccessToken,
    }).addTo(self.mymap);
    self.markers.push(window.L.marker(location).addTo(self.mymap));
    self.mymap.on('click', (e) => {
      self.markers.forEach((m) => {
        self.mymap.removeLayer(m);
      });
      self.props.onChange({ target: { value: `${e.latlng.lat},${e.latlng.lng}` } });
    });
  }

  componentWillReceiveProps(props) {
    const { location } = props;
    this.setState({ lat: location[0], lng: location[1] });
    this.markers.forEach((m) => {
      this.mymap.removeLayer(m);
    });
    this.mymap.setView(location, 13);
    this.markers.push(window.L.marker(location).addTo(this.mymap));
  }

    handleChange = key => (event) => {
      const lat = key === 'lat' ? event.target.value : this.state.lat;
      const lng = key === 'lng' ? event.target.value : this.state.lng;
      this.props.onChange({ target: { value: `${lat},${lng}` } });
    };

    render() {
      return (
        <div>
          <div id={this.state.id} style={{ width: '800px', height: '400px' }} />
          <TextField
            style={{ width: '300px' }}
            id="lat"
            label="Lat"
            value={this.state.lat}
            onChange={this.handleChange('lat')}
          />
          <br />
          <TextField
            style={{ width: '300px', marginTop: '30px' }}
            id="lon"
            label="Lng"
            value={this.state.lng}
            onChange={this.handleChange('lng')}
          />
          <br />
        </div>

      );
    }
}


export default LeafLetMap;
