import React from 'react';
import { DomEvent } from 'leaflet';
import { makeStyles } from "@material-ui/core/styles";

const style = {
    container: {

        position: 'absolute',
        zIndex: 1999,
        backgroundColor: 'white',
        fontFamily: 'Inter',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: '#FFFFFF',
        boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.04), 0px 20px 25px rgba(0, 0, 0, 0.1)',
    },
    row: {
        width: '100%',
        cursor: 'pointer',
        padding: '10px 14px',
        '&:hover': {
            background: '#DDF5FC',
        }

    }
}
const useStyles = makeStyles(style)

export const MarkContextmenu = ({ menuRows, isShow, position, onClose }) => {
    const classes = useStyles();
    const divRef = React.useRef(null);

    React.useEffect(() => {
        if (divRef.current)
            DomEvent.disableClickPropagation(divRef.current);
    });

    return (
        isShow &&
        <div 
            className={classes.container}
            style={{top: position.y,left: position.x,}}
            ref={divRef}
            onClick={onClose}
        >
            {
                menuRows.map(({ onClick, text }) => (
                    <span
                    className={classes.row}
                    onClick={(e) => { onClick(); console.log(e) }}
                    >
                    {text}
                    </span>
                ))
            }
            <span  className={classes.row}>Cancel</span>
        </div>
    )

}