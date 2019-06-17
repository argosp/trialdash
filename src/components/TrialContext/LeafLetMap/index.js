import React from 'react';
import config from './../../../config';

class LeafLetMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zoom: 13
        };
    }

    componentWillReceiveProps(props) {
        let { position } = props;
        this.mymap.setView(position, 13);
        window.L.marker(position).addTo(this.mymap);
    }

    componentDidMount() {
        let { position } = this.props;
        this.mymap = window.L.map('mapid').setView(position, 13);
        window.L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${config.mapboxAccessToken}`, {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: config.mapboxAccessToken
        }).addTo(this.mymap);
        window.L.marker(position).addTo(this.mymap);
    }

    render() {
        return (
            <div id="mapid" style={{width: '800px', height: '400px'}}>
            </div>
          )
    }
}


export default LeafLetMap;