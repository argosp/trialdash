import React from 'react'
import { DomEvent } from 'leaflet'
export const MarkContextmenu = ({ menuRows,isShow, position, onClose}) =>{

    const divRef = React.useRef(null);

    React.useEffect(() => {
    if(divRef.current)
      DomEvent.disableClickPropagation(divRef.current);
    });

    return (
    isShow &&
    <div style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        zIndex: 1999,
        border: '2px solid black',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column'
        }}
        ref={divRef}
        onClick={onClose}
        >
        {
            menuRows.map(({onClick, text}) => (
                <span onClick={(e) => {onClick(); console.log(e)}}>{text}</span>
            ))
        }
        <span>Cancel</span>
    </div>
  )

    }