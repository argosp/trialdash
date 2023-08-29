import React, { useState } from 'react';
import {
    useMapEvents,
} from "react-leaflet";
import {
    Paper
} from "@material-ui/core";

export const MapCoordinates = ({ showAsLatLong = true }) => {
    const [latlng, setLatlng] = useState({ lat: 0, lng: 0 });

    const mapObj = useMapEvents({
        mousemove: (e) => setLatlng(e.latlng)
    });

    const round = (num, digits) => {
        const c = 10 ** digits;
        return Math.round(num * c) / c;
    }

    let str = '';
    if (showAsLatLong) {
        str = `${round(latlng.lat, 6)} ${latlng.lat < 0 ? 'S' : 'N'}, ${round(latlng.lng, 6)} ${latlng.lng < 0 ? 'W' : 'E'}`;
    } else {
        str = `${round(latlng.lng, 3)}, ${round(latlng.lat, 3)}`;
    }

    return (
        <Paper style={{ padding: '0.5em' }}>
            <span>
                {str}
            </span>
        </Paper>
    )
}

