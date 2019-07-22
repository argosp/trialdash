import React from 'react';
import config from './../../../config';
import TextField from '@material-ui/core/TextField';

class LeafLetMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom: 13
        };
    }

    componentWillReceiveProps(props) {
        let { position } = props;
        this.setState({ lat: position[0], lng: position[1] });
        this.markers.forEach(m => {
            this.mymap.removeLayer(m);
        });
        this.mymap.setView(position, 13);
        this.markers.push(window.L.marker(position).addTo(this.mymap));
    }

    componentDidMount() {
        let _this = this;
        _this.markers = [];
        let { position } = _this.props;
        _this.mymap = window.L.map('mapid').setView(position, 13);
        window.L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${config.mapboxAccessToken}`, {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: config.mapboxAccessToken
        }).addTo(_this.mymap);
        _this.markers.push(window.L.marker(position).addTo(_this.mymap));
        _this.mymap.on('click', function(e) {
            _this.markers.forEach(m => {
                _this.mymap.removeLayer(m);
            });
            _this.props.onChange({target: {value: e.latlng.lat + "," + e.latlng.lng}});
        });
    }

    handleChange = key => event => {
        let lat = key === 'lat' ? event.target.value : this.state.lat;
        let lng = key === 'lng' ? event.target.value : this.state.lng;
        this.props.onChange({target: {value: lat + "," + lng}});
    };

    render() {
        return (
            <div>
                <div id="mapid" style={{width: '800px', height: '400px'}}></div>
                <TextField style={{ width: '300px' }}
                    id="lat"
                    label="Lat"
                    value={this.state.lat}
                    onChange={this.handleChange('lat')}
                />
                <br />
                <TextField style={{ width: '300px', 'marginTop': '30px' }}
                    id="lon"
                    label="Lng"
                    value={this.state.lng}
                    onChange={this.handleChange('lng')}
                />
                <br />
            </div>

          )
    }
}


export default LeafLetMap;